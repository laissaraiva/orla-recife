import { useState, useCallback } from 'react';
import { UnifiedBeach, MapboxFeature, MapboxGeocodingResponse } from '@/types/beach';
import { Beach } from '@/hooks/useBeaches';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicGhzcDIiLCJhIjoiY21pdnpydWloMXVuaDNkcTJoMTBiaXNjdSJ9.VgPr50l5WyLY7zE-_-NlLg';

// Recife bounding box for focused search
const RECIFE_BBOX = '-35.05,-8.2,-34.8,-7.9';

interface UseBeachGeocodingOptions {
  supabaseBeaches: Beach[];
}

export const useBeachGeocoding = ({ supabaseBeaches }: UseBeachGeocodingOptions) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UnifiedBeach[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fuzzy match beach name (simple similarity)
  const fuzzyMatch = (name1: string, name2: string): boolean => {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/praia (de |do |da |dos |das )?/gi, '')
        .trim();
    
    const n1 = normalize(name1);
    const n2 = normalize(name2);
    
    // Exact match after normalization
    if (n1 === n2) return true;
    
    // One contains the other
    if (n1.includes(n2) || n2.includes(n1)) return true;
    
    return false;
  };

  // Try to find a matching Supabase beach for a Mapbox result
  const findSupabaseMatch = (mapboxBeach: { name: string; lat: number; lng: number }): Beach | null => {
    const DISTANCE_THRESHOLD_KM = 0.5; // 500 meters

    for (const supabaseBeach of supabaseBeaches) {
      // Try name match first
      if (fuzzyMatch(mapboxBeach.name, supabaseBeach.name)) {
        return supabaseBeach;
      }

      // Try proximity match
      const distance = calculateDistance(
        mapboxBeach.lat,
        mapboxBeach.lng,
        supabaseBeach.coordinates.lat,
        supabaseBeach.coordinates.lng
      );

      if (distance <= DISTANCE_THRESHOLD_KM) {
        return supabaseBeach;
      }
    }

    return null;
  };

  // Convert Mapbox feature to UnifiedBeach
  const mapboxToUnified = (feature: MapboxFeature): UnifiedBeach => {
    const [lng, lat] = feature.center;
    
    // Extract neighborhood from context
    const neighborhoodContext = feature.context?.find(c => 
      c.id.startsWith('neighborhood') || c.id.startsWith('locality')
    );
    const neighborhood = neighborhoodContext?.text || 
      feature.context?.find(c => c.id.startsWith('place'))?.text || 
      'Recife';

    const mapboxData = {
      name: feature.text,
      lat,
      lng,
    };

    // Try to find matching Supabase beach
    const supabaseMatch = findSupabaseMatch(mapboxData);

    if (supabaseMatch) {
      // Enriched result - combine Mapbox location with Supabase data
      return {
        id: `enriched-${supabaseMatch.id}`,
        name: supabaseMatch.name,
        neighborhood: supabaseMatch.neighborhood,
        coordinates: supabaseMatch.coordinates,
        address: feature.place_name,
        status: supabaseMatch.status,
        waveHeight: supabaseMatch.waveHeight,
        sharkRisk: supabaseMatch.sharkRisk,
        waterTemperature: supabaseMatch.waterTemperature,
        coliformLevel: supabaseMatch.coliformLevel,
        description: supabaseMatch.description,
        amenities: supabaseMatch.amenities,
        lastUpdate: supabaseMatch.lastUpdate,
        source: 'enriched',
        supabaseId: supabaseMatch.id,
      };
    }

    // Mapbox-only result
    return {
      id: `mapbox-${feature.id}`,
      name: feature.text,
      neighborhood,
      coordinates: { lat, lng },
      address: feature.place_name,
      source: 'mapbox',
    };
  };

  // Search for beaches using Mapbox Geocoding API
  const searchBeaches = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // First, search in Supabase beaches (local filter)
      const localMatches = supabaseBeaches.filter(beach =>
        beach.name.toLowerCase().includes(query.toLowerCase()) ||
        beach.neighborhood.toLowerCase().includes(query.toLowerCase())
      );

      // Convert local matches to UnifiedBeach format
      const localResults: UnifiedBeach[] = localMatches.map(beach => ({
        id: `supabase-${beach.id}`,
        name: beach.name,
        neighborhood: beach.neighborhood,
        coordinates: beach.coordinates,
        status: beach.status,
        waveHeight: beach.waveHeight,
        sharkRisk: beach.sharkRisk,
        waterTemperature: beach.waterTemperature,
        coliformLevel: beach.coliformLevel,
        description: beach.description,
        amenities: beach.amenities,
        lastUpdate: beach.lastUpdate,
        source: 'supabase' as const,
        supabaseId: beach.id,
      }));

      // Then, search Mapbox for additional beaches
      const searchQuery = encodeURIComponent(`praia ${query}`);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${MAPBOX_ACCESS_TOKEN}&bbox=${RECIFE_BBOX}&types=poi&limit=5&language=pt`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar praias');
      }

      const data: MapboxGeocodingResponse = await response.json();

      // Filter for beach-related POIs and convert to UnifiedBeach
      const mapboxResults = data.features
        .filter(feature => {
          const name = feature.text.toLowerCase();
          const placeName = feature.place_name.toLowerCase();
          return name.includes('praia') || placeName.includes('praia') || placeName.includes('beach');
        })
        .map(mapboxToUnified);

      // Deduplicate results (prefer Supabase/enriched over Mapbox-only)
      const seenIds = new Set<string>();
      const allResults: UnifiedBeach[] = [];

      // Add local results first
      for (const result of localResults) {
        seenIds.add(result.supabaseId || result.id);
        allResults.push(result);
      }

      // Add Mapbox results that aren't duplicates
      for (const result of mapboxResults) {
        if (result.source === 'enriched' && result.supabaseId) {
          if (!seenIds.has(result.supabaseId)) {
            seenIds.add(result.supabaseId);
            allResults.push(result);
          }
        } else if (result.source === 'mapbox') {
          // Check if this Mapbox result matches any existing result by proximity
          const isDuplicate = allResults.some(existing => {
            const distance = calculateDistance(
              result.coordinates.lat,
              result.coordinates.lng,
              existing.coordinates.lat,
              existing.coordinates.lng
            );
            return distance < 0.3; // 300m threshold for duplicates
          });

          if (!isDuplicate) {
            allResults.push(result);
          }
        }
      }

      setSearchResults(allResults);
    } catch (err) {
      console.error('Beach search error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar praias');
      
      // Fallback to local results only
      const localMatches = supabaseBeaches.filter(beach =>
        beach.name.toLowerCase().includes(query.toLowerCase()) ||
        beach.neighborhood.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(localMatches.map(beach => ({
        id: `supabase-${beach.id}`,
        name: beach.name,
        neighborhood: beach.neighborhood,
        coordinates: beach.coordinates,
        status: beach.status,
        waveHeight: beach.waveHeight,
        sharkRisk: beach.sharkRisk,
        waterTemperature: beach.waterTemperature,
        coliformLevel: beach.coliformLevel,
        description: beach.description,
        amenities: beach.amenities,
        lastUpdate: beach.lastUpdate,
        source: 'supabase' as const,
        supabaseId: beach.id,
      })));
    } finally {
      setIsSearching(false);
    }
  }, [supabaseBeaches]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchBeaches,
    searchResults,
    isSearching,
    error,
    clearResults,
  };
};
