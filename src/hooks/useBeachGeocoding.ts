import { useState, useCallback } from 'react';
import { UnifiedBeach } from '@/types/beach';
import { Beach } from '@/hooks/useBeaches';

interface UseBeachGeocodingOptions {
  supabaseBeaches: Beach[];
}

export const useBeachGeocoding = ({ supabaseBeaches }: UseBeachGeocodingOptions) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UnifiedBeach[]>([]);

  // Fuzzy match beach name
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
    
    if (n1 === n2) return true;
    if (n1.includes(n2) || n2.includes(n1)) return true;
    
    return false;
  };

  // Search for beaches in Supabase only
  const searchBeaches = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Filter Supabase beaches that match the query
      const localMatches = supabaseBeaches.filter(beach =>
        fuzzyMatch(beach.name, query) ||
        fuzzyMatch(beach.neighborhood, query)
      );

      // Convert to UnifiedBeach format
      const results: UnifiedBeach[] = localMatches.map(beach => ({
        id: beach.id,
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

      setSearchResults(results);
    } catch (err) {
      console.error('Beach search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [supabaseBeaches]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchBeaches,
    searchResults,
    isSearching,
    clearResults,
  };
};
