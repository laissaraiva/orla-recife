import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AppLayout } from '@/components/layout/AppLayout';
import { lifeguardPosts } from '@/data/mockBeaches';
import { useBeaches, getStatusColor } from '@/hooks/useBeaches';
import { useBeachGeocoding } from '@/hooks/useBeachGeocoding';
import { UnifiedBeach } from '@/types/beach';
import { Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EmergencyButton } from '@/components/map/EmergencyButton';
import { BeachDetailsPanel } from '@/components/map/BeachDetailsPanel';
import { BeachSearchBar } from '@/components/map/BeachSearchBar';
import { useBeachLikes } from '@/hooks/useBeachLikes';

mapboxgl.accessToken = 'pk.eyJ1IjoicGhzcDIiLCJhIjoiY21pdnpydWloMXVuaDNkcTJoMTBiaXNjdSJ9.VgPr50l5WyLY7zE-_-NlLg';

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const beachMarkers = useRef<mapboxgl.Marker[]>([]);
  const lifeguardMarkers = useRef<mapboxgl.Marker[]>([]);

  const { beaches, loading: beachesLoading } = useBeaches();
  const { searchBeaches, searchResults, isSearching, clearResults } = useBeachGeocoding({ supabaseBeaches: beaches });
  
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedBeach, setSelectedBeach] = useState<UnifiedBeach | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { getLikeData, toggleLike } = useBeachLikes();

  const getStatusMarkerColor = (status?: UnifiedBeach['status']) => {
    switch (status) {
      case 'safe':
        return '#22c55e';
      case 'warning':
        return '#eab308';
      case 'danger':
        return '#ef4444';
      default:
        return '#22c55e'; // Default to safe for unknown beaches
    }
  };

  const getUserLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setLoadingLocation(false);
          
          if (map.current) {
            map.current.flyTo({
              center: [coords.lng, coords.lat],
              zoom: 14,
              duration: 1500,
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          const fallback = { lat: -8.1193, lng: -34.8953 };
          setUserLocation(fallback);
          setLoadingLocation(false);
        }
      );
    } else {
      const fallback = { lat: -8.1193, lng: -34.8953 };
      setUserLocation(fallback);
      setLoadingLocation(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
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

  const sortedBeaches = userLocation
    ? [...beaches].sort((a, b) => {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distA - distB;
      })
    : beaches;


  // Initialize map - focused on Recife beaches
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Bounds for Recife beaches area
    const recifeBounds: [[number, number], [number, number]] = [
      [-34.9150, -8.1450], // Southwest
      [-34.8650, -8.0750], // Northeast
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-34.8870, -8.1100], // Centro das praias de Recife
      zoom: 13.5,
      minZoom: 12,
      maxZoom: 16,
      maxBounds: [
        [-34.95, -8.18], // Southwest
        [-34.84, -8.05], // Northeast
      ],
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: false }),
      'top-right'
    );

    map.current.on('load', () => {
      // Remove POI labels (commercial, tourist points) - keep only our custom markers
      const layersToHide = [
        'poi-label',
        'transit-label',
        'airport-label',
        'settlement-subdivision-label',
        'natural-point-label'
      ];
      
      layersToHide.forEach(layerId => {
        if (map.current?.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, 'visibility', 'none');
        }
      });
      
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add beach markers
  useEffect(() => {
    if (!map.current || !mapLoaded || beaches.length === 0) return;

    // Clear existing markers
    beachMarkers.current.forEach(marker => marker.remove());
    beachMarkers.current = [];

    beaches.forEach((beach) => {
      // Create wave icon marker
      const el = document.createElement('div');
      el.className = 'beach-marker';
      el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background-color: ${getStatusMarkerColor(beach.status)};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
          font-size: 20px;
        ">
          🌊
        </div>
      `;
      
      el.addEventListener('mouseenter', () => {
        el.querySelector('div')!.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.querySelector('div')!.style.transform = 'scale(1)';
      });
      el.addEventListener('click', () => {
        // Convert Beach to UnifiedBeach
        const unifiedBeach: UnifiedBeach = {
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
          source: 'supabase',
          supabaseId: beach.id,
        };
        setSelectedBeach(unifiedBeach);
        map.current?.flyTo({
          center: [beach.coordinates.lng, beach.coordinates.lat],
          zoom: 14,
          duration: 1000,
        });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([beach.coordinates.lng, beach.coordinates.lat])
        .addTo(map.current!);

      beachMarkers.current.push(marker);
    });
  }, [mapLoaded, beaches]);

  // Add lifeguard markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    lifeguardMarkers.current.forEach(marker => marker.remove());
    lifeguardMarkers.current = [];

    lifeguardPosts.forEach((post) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background-color: ${post.active ? '#3b82f6' : '#9ca3af'};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        ">
          🏊
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <strong>${post.name}</strong>
          <p style="margin: 4px 0 0; color: ${post.active ? 'green' : 'gray'};">
            ${post.active ? '✓ Ativo' : '✗ Inativo'}
          </p>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([post.coordinates.lng, post.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);

      lifeguardMarkers.current.push(marker);
    });
  }, [mapLoaded]);

  // Update user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.setLngLat([userLocation.lng, userLocation.lat]);
    } else {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          width: 20px;
          height: 20px;
          background-color: #2563eb;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.3);
        "></div>
      `;

      userMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    }
  }, [userLocation, mapLoaded]);

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-7.5rem)]">
        {/* Map Container */}
        <div className="relative flex-1">
          <div ref={mapContainer} className="absolute inset-0" />

          {/* Floating Search Bar */}
          <BeachSearchBar
            searchResults={searchResults}
            isSearching={isSearching}
            onSearch={searchBeaches}
            onSelectBeach={(beach: UnifiedBeach) => {
              setSelectedBeach(beach);
              map.current?.flyTo({
                center: [beach.coordinates.lng, beach.coordinates.lat],
                zoom: 15,
                duration: 1500,
              });
            }}
            onClear={clearResults}
          />

          {/* Emergency Button */}
          <div className="absolute top-16 right-16 z-10">
            <EmergencyButton />
          </div>

          {/* Location button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 shadow-lg z-10"
            onClick={getUserLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
          </Button>

          {/* Legend */}
          <Card className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm z-10">
            <CardContent className="p-3">
              <p className="text-xs font-medium text-foreground mb-2">Legenda</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span>🌊</span>
                  <div className="w-3 h-3 rounded-full bg-status-safe" />
                  <span className="text-xs text-muted-foreground">Própria</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌊</span>
                  <div className="w-3 h-3 rounded-full bg-status-warning" />
                  <span className="text-xs text-muted-foreground">Atenção</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌊</span>
                  <div className="w-3 h-3 rounded-full bg-status-danger" />
                  <span className="text-xs text-muted-foreground">Imprópria</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <span>🏊</span>
                  <span className="text-xs text-muted-foreground">Salva-vidas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Beach Details Panel */}
        {selectedBeach ? (
          <BeachDetailsPanel
            beach={selectedBeach}
            distance={
              userLocation
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    selectedBeach.coordinates.lat,
                    selectedBeach.coordinates.lng
                  )
                : undefined
            }
            likeCount={getLikeData(selectedBeach.supabaseId || selectedBeach.id).count}
            userLiked={getLikeData(selectedBeach.supabaseId || selectedBeach.id).userLiked}
            onToggleLike={toggleLike}
            onClose={() => setSelectedBeach(null)}
          />
        ) : (
          <div className="bg-card border-t border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">
              Praias Próximas
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {sortedBeaches.slice(0, 4).map((beach) => (
                <div
                  key={beach.id}
                  className="shrink-0 w-40"
                  onClick={() => {
                    // Convert Beach to UnifiedBeach
                    const unifiedBeach: UnifiedBeach = {
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
                      source: 'supabase',
                      supabaseId: beach.id,
                    };
                    setSelectedBeach(unifiedBeach);
                    map.current?.flyTo({
                      center: [beach.coordinates.lng, beach.coordinates.lat],
                      zoom: 14,
                      duration: 1000,
                    });
                  }}
                >
                  <Card className="cursor-pointer hover:shadow-soft transition-shadow">
                    <CardContent className="p-3">
                      <Badge
                        className={cn(
                          'text-xs font-medium text-white border-0 mb-2',
                          getStatusColor(beach.status)
                        )}
                      >
                        {beach.status === 'safe'
                          ? '🌊 OK'
                          : beach.status === 'warning'
                          ? '🌊 !'
                          : '🌊 X'}
                      </Badge>
                      <p className="font-medium text-sm text-foreground truncate">
                        {beach.name.replace('Praia de ', '').replace('Praia do ', '')}
                      </p>
                      {userLocation && (
                        <p className="text-xs text-muted-foreground">
                          {calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            beach.coordinates.lat,
                            beach.coordinates.lng
                          ).toFixed(1)}{' '}
                          km
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MapView;
