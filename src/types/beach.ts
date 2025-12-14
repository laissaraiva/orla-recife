// Unified beach type that combines Mapbox geocoding results with Supabase data
export interface UnifiedBeach {
  id: string;
  name: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // From Mapbox
  address?: string;
  // From Supabase (optional - may not exist for Mapbox-only results)
  status?: 'safe' | 'warning' | 'danger';
  waveHeight?: number;
  sharkRisk?: 'low' | 'medium' | 'high';
  waterTemperature?: number;
  coliformLevel?: 'normal' | 'elevated' | 'high';
  description?: string;
  amenities?: string[];
  lastUpdate?: string;
  // Source tracking
  source: 'supabase' | 'mapbox' | 'enriched'; // enriched = mapbox + supabase match
  supabaseId?: string; // Original Supabase ID if matched
}

// Mapbox geocoding result structure
export interface MapboxFeature {
  id: string;
  type: string;
  place_type: string[];
  text: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  properties: {
    category?: string;
    maki?: string;
    address?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export interface MapboxGeocodingResponse {
  type: string;
  features: MapboxFeature[];
}
