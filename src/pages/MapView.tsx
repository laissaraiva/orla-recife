import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BeachCard } from '@/components/beach/BeachCard';
import { beaches, Beach, getStatusColor } from '@/data/mockBeaches';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MapView = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);

  const getUserLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Recife center
          setUserLocation({ lat: -8.0578, lng: -34.8829 });
          setLoadingLocation(false);
        }
      );
    } else {
      setUserLocation({ lat: -8.0578, lng: -34.8829 });
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

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

  const toggleFavorite = (beachId: string) => {
    setFavorites((prev) =>
      prev.includes(beachId)
        ? prev.filter((id) => id !== beachId)
        : [...prev, beachId]
    );
  };

  const getStatusMarkerColor = (status: Beach['status']) => {
    switch (status) {
      case 'safe':
        return 'bg-status-safe';
      case 'warning':
        return 'bg-status-warning';
      case 'danger':
        return 'bg-status-danger';
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-7.5rem)]">
        {/* Map Placeholder */}
        <div className="relative flex-1 bg-ocean-light/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-beach opacity-50" />

          {/* Map visualization placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Beach markers */}
              {beaches.map((beach, index) => {
                // Calculate position based on coordinates (simplified for demo)
                const top = 10 + (index % 4) * 20;
                const left = 15 + (index % 3) * 25;

                return (
                  <button
                    key={beach.id}
                    className={cn(
                      'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200',
                      selectedBeach?.id === beach.id && 'scale-125 z-10'
                    )}
                    style={{ top: `${top}%`, left: `${left}%` }}
                    onClick={() => setSelectedBeach(beach)}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white',
                        getStatusMarkerColor(beach.status)
                      )}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium text-foreground bg-card/90 px-2 py-0.5 rounded whitespace-nowrap">
                      {beach.name.replace('Praia de ', '').replace('Praia do ', '')}
                    </span>
                  </button>
                );
              })}

              {/* User location marker */}
              {userLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ top: '45%', left: '50%' }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 shadow-lg"
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
          <Card className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <p className="text-xs font-medium text-foreground mb-2">Legenda</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-safe" />
                  <span className="text-xs text-muted-foreground">Própria</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-warning" />
                  <span className="text-xs text-muted-foreground">Atenção</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-danger" />
                  <span className="text-xs text-muted-foreground">Imprópria</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Beach Details Panel */}
        {selectedBeach ? (
          <div className="bg-card border-t border-border p-4 animate-in slide-in-from-bottom duration-300">
            <BeachCard
              beach={selectedBeach}
              isFavorite={favorites.includes(selectedBeach.id)}
              onToggleFavorite={toggleFavorite}
            />
            {userLocation && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                ~{' '}
                {calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  selectedBeach.coordinates.lat,
                  selectedBeach.coordinates.lng
                ).toFixed(1)}{' '}
                km de distância
              </p>
            )}
          </div>
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
                  onClick={() => setSelectedBeach(beach)}
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
                          ? 'OK'
                          : beach.status === 'warning'
                          ? '!'
                          : 'X'}
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
