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
  // CPRH data
  waveHeight: number; // in meters
  sharkRisk: 'low' | 'medium' | 'high';
  waterTemperature: number; // in celsius
  coliformLevel: 'normal' | 'elevated' | 'high';
}

export interface LifeguardPost {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  active: boolean;
  phone?: string;
}

// Praias de Recife - coordenadas ajustadas para não sobrepor com salva-vidas
export const beaches: Beach[] = [
  {
    id: '1',
    name: 'Praia de Boa Viagem',
    neighborhood: 'Boa Viagem',
    status: 'safe',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.1150, lng: -34.8920 },
    description: 'Uma das praias mais famosas do Recife, com extensa faixa de areia e águas mornas.',
    amenities: ['Quiosques', 'Chuveiros', 'Salva-vidas', 'Estacionamento'],
    waveHeight: 0.8,
    sharkRisk: 'medium',
    waterTemperature: 28,
    coliformLevel: 'normal',
  },
  {
    id: '2',
    name: 'Praia do Pina',
    neighborhood: 'Pina',
    status: 'warning',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.0928, lng: -34.8756 },
    description: 'Praia urbana próxima ao centro, com bela vista da cidade.',
    amenities: ['Quiosques', 'Restaurantes', 'Ciclovia'],
    waveHeight: 0.6,
    sharkRisk: 'low',
    waterTemperature: 27,
    coliformLevel: 'elevated',
  },
  {
    id: '3',
    name: 'Praia de Brasília Teimosa',
    neighborhood: 'Brasília Teimosa',
    status: 'danger',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.0820, lng: -34.8710 },
    description: 'Comunidade tradicional de pescadores no Recife.',
    amenities: ['Restaurantes de frutos do mar'],
    waveHeight: 0.5,
    sharkRisk: 'low',
    waterTemperature: 27,
    coliformLevel: 'high',
  },
  {
    id: '4',
    name: 'Praia de Boa Viagem (Sul)',
    neighborhood: 'Boa Viagem Sul',
    status: 'safe',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.1320, lng: -34.9020 },
    description: 'Trecho sul da praia de Boa Viagem, mais tranquilo e familiar.',
    amenities: ['Quiosques', 'Salva-vidas', 'Estacionamento'],
    waveHeight: 0.7,
    sharkRisk: 'medium',
    waterTemperature: 28,
    coliformLevel: 'normal',
  },
];

// Postos de salva-vida - posicionados entre as praias, não sobrepostos
export const lifeguardPosts: LifeguardPost[] = [
  {
    id: 'lg1',
    name: 'Posto 1 - Pina',
    coordinates: { lat: -8.0870, lng: -34.8730 },
    active: true,
    phone: '193',
  },
  {
    id: 'lg2',
    name: 'Posto 2 - Boa Viagem Norte',
    coordinates: { lat: -8.1050, lng: -34.8870 },
    active: true,
    phone: '193',
  },
  {
    id: 'lg3',
    name: 'Posto 3 - Boa Viagem Centro',
    coordinates: { lat: -8.1230, lng: -34.8980 },
    active: true,
    phone: '193',
  },
  {
    id: 'lg4',
    name: 'Posto 4 - Boa Viagem Sul',
    coordinates: { lat: -8.1400, lng: -34.9060 },
    active: false,
  },
];

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'alert' | 'news' | 'weather';
  imageUrl?: string;
}

export const news: NewsItem[] = [
  {
    id: '1',
    title: 'Alerta de chuvas fortes para o fim de semana',
    summary: 'APAC prevê precipitações intensas que podem afetar a balneabilidade das praias.',
    date: '2024-12-08',
    category: 'weather',
  },
  {
    id: '2',
    title: 'Praias de Boa Viagem apresentam condições ideais',
    summary: 'Análise da CPRH confirma águas próprias para banho na região.',
    date: '2024-12-07',
    category: 'news',
  },
  {
    id: '3',
    title: 'CPRH: Risco de tubarões em Boa Viagem permanece moderado',
    summary: 'Monitoramento contínuo na área. Evite banho após 16h e em dias nublados.',
    date: '2024-12-06',
    category: 'alert',
  },
  {
    id: '4',
    title: 'Atenção: Brasília Teimosa imprópria para banho',
    summary: 'Níveis elevados de coliformes detectados. CPRH recomenda evitar a área.',
    date: '2024-12-05',
    category: 'alert',
  },
  {
    id: '5',
    title: 'Ondas podem chegar a 1m em Boa Viagem nesta semana',
    summary: 'Marinha alerta para mar agitado no litoral sul da RMR.',
    date: '2024-12-04',
    category: 'weather',
  },
];

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
