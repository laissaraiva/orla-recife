import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type BeachStatus = 'safe' | 'warning' | 'danger';

export interface Beach {
  id: string;
  name: string;
  neighborhood: string;
  status: BeachStatus;
  lastUpdate: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  amenities: string[];
  waveHeight: number;
  sharkRisk: 'low' | 'medium' | 'high';
  waterTemperature: number;
  coliformLevel: 'normal' | 'elevated' | 'high';
}

interface DbBeach {
  id: string;
  name: string;
  neighborhood: string;
  status: string;
  last_update: string;
  coordinates_lat: number;
  coordinates_lng: number;
  description: string | null;
  amenities: string[] | null;
  wave_height: number | null;
  shark_risk: string | null;
  water_temperature: number | null;
  coliform_level: string | null;
}

const mapDbBeachToBeach = (dbBeach: DbBeach): Beach => ({
  id: dbBeach.id,
  name: dbBeach.name,
  neighborhood: dbBeach.neighborhood,
  status: dbBeach.status as BeachStatus,
  lastUpdate: dbBeach.last_update,
  coordinates: {
    lat: dbBeach.coordinates_lat,
    lng: dbBeach.coordinates_lng,
  },
  description: dbBeach.description || '',
  amenities: dbBeach.amenities || [],
  waveHeight: dbBeach.wave_height || 0,
  sharkRisk: (dbBeach.shark_risk as Beach['sharkRisk']) || 'low',
  waterTemperature: dbBeach.water_temperature || 25,
  coliformLevel: (dbBeach.coliform_level as Beach['coliformLevel']) || 'normal',
});

export const useBeaches = () => {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBeaches = async () => {
      try {
        const { data, error } = await supabase
          .from('beaches')
          .select('*')
          .order('name');

        if (error) throw error;

        setBeaches((data as DbBeach[]).map(mapDbBeachToBeach));
      } catch (err) {
        console.error('Error fetching beaches:', err);
        setError('Erro ao carregar praias');
      } finally {
        setLoading(false);
      }
    };

    fetchBeaches();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('beaches-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'beaches',
        },
        (payload) => {
          console.log('Beach updated:', payload);
          const updatedBeach = mapDbBeachToBeach(payload.new as DbBeach);
          const oldBeach = mapDbBeachToBeach(payload.old as DbBeach);

          setBeaches((prev) =>
            prev.map((beach) =>
              beach.id === updatedBeach.id ? updatedBeach : beach
            )
          );

          // Show toast notification if status changed
          if (oldBeach.status !== updatedBeach.status) {
            const statusLabels = {
              safe: 'Própria para banho',
              warning: 'Atenção',
              danger: 'Imprópria para banho',
            };
            
            toast({
              title: `🌊 ${updatedBeach.name}`,
              description: `Status atualizado: ${statusLabels[updatedBeach.status]}`,
              variant: updatedBeach.status === 'danger' ? 'destructive' : 'default',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'beaches',
        },
        (payload) => {
          console.log('New beach added:', payload);
          const newBeach = mapDbBeachToBeach(payload.new as DbBeach);
          setBeaches((prev) => [...prev, newBeach]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return { beaches, loading, error };
};

export const getStatusLabel = (status: BeachStatus): string => {
  switch (status) {
    case 'safe':
      return 'Própria para banho';
    case 'warning':
      return 'Atenção';
    case 'danger':
      return 'Imprópria para banho';
  }
};

export const getStatusColor = (status: BeachStatus): string => {
  switch (status) {
    case 'safe':
      return 'bg-status-safe';
    case 'warning':
      return 'bg-status-warning';
    case 'danger':
      return 'bg-status-danger';
  }
};

export const getSharkRiskLabel = (risk: Beach['sharkRisk']): string => {
  switch (risk) {
    case 'low':
      return 'Baixo';
    case 'medium':
      return 'Moderado';
    case 'high':
      return 'Alto';
  }
};

export const getSharkRiskColor = (risk: Beach['sharkRisk']): string => {
  switch (risk) {
    case 'low':
      return 'text-status-safe';
    case 'medium':
      return 'text-status-warning';
    case 'high':
      return 'text-status-danger';
  }
};
