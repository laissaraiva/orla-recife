// Unified beach type for search results
export interface UnifiedBeach {
  id: string;
  name: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  status?: 'safe' | 'warning' | 'danger';
  waveHeight?: number;
  sharkRisk?: 'low' | 'medium' | 'high';
  waterTemperature?: number;
  coliformLevel?: 'normal' | 'elevated' | 'high';
  description?: string;
  amenities?: string[];
  lastUpdate?: string;
  source: 'supabase';
  supabaseId?: string;
}
