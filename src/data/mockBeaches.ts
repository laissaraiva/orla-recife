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

export const lifeguardPosts: LifeguardPost[] = [
  {
    id: 'lg1',
    name: 'Posto 1 - Boa Viagem Norte',
    coordinates: { lat: -8.1120, lng: -34.8920 },
    active: true,
    phone: '193',
  },
  {
    id: 'lg2',
    name: 'Posto 2 - Boa Viagem Centro',
    coordinates: { lat: -8.1193, lng: -34.8953 },
    active: true,
    phone: '193',
  },
  {
    id: 'lg3',
    name: 'Posto 3 - Boa Viagem Sul',
    coordinates: { lat: -8.1280, lng: -34.9000 },
    active: true,
    phone: '193',
  },
  {
    id: 'lg4',
    name: 'Posto 4 - Piedade',
    coordinates: { lat: -8.1544, lng: -34.9161 },
    active: true,
    phone: '193',
  },
  {
    id: 'lg5',
    name: 'Posto 5 - Candeias',
    coordinates: { lat: -8.1756, lng: -34.9260 },
    active: false,
  },
];

export const beaches: Beach[] = [
  {
    id: '1',
    name: 'Praia de Boa Viagem',
    neighborhood: 'Boa Viagem',
    status: 'safe',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.1193, lng: -34.8953 },
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
    name: 'Praia de Piedade',
    neighborhood: 'Piedade',
    status: 'safe',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.1544, lng: -34.9161 },
    description: 'Praia tranquila no município de Jaboatão dos Guararapes.',
    amenities: ['Quiosques', 'Estacionamento', 'Salva-vidas'],
    waveHeight: 1.0,
    sharkRisk: 'medium',
    waterTemperature: 27,
    coliformLevel: 'normal',
  },
  {
    id: '4',
    name: 'Praia de Candeias',
    neighborhood: 'Candeias',
    status: 'danger',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.1756, lng: -34.9267 },
    description: 'Praia com piscinas naturais formadas pelos recifes.',
    amenities: ['Quiosques', 'Restaurantes'],
    waveHeight: 1.5,
    sharkRisk: 'high',
    waterTemperature: 26,
    coliformLevel: 'high',
  },
  {
    id: '5',
    name: 'Praia de Barra de Jangada',
    neighborhood: 'Barra de Jangada',
    status: 'safe',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.2167, lng: -34.9433 },
    description: 'Encontro do rio com o mar, paisagem única e passeios de jangada.',
    amenities: ['Passeio de jangada', 'Restaurantes', 'Pesca'],
    waveHeight: 0.5,
    sharkRisk: 'low',
    waterTemperature: 28,
    coliformLevel: 'normal',
  },
  {
    id: '6',
    name: 'Praia de Casa Caiada',
    neighborhood: 'Casa Caiada',
    status: 'warning',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -7.9856, lng: -34.8456 },
    description: 'Praia com calçadão e área de lazer em Olinda.',
    amenities: ['Calçadão', 'Quiosques', 'Área de lazer'],
    waveHeight: 0.7,
    sharkRisk: 'low',
    waterTemperature: 27,
    coliformLevel: 'elevated',
  },
  {
    id: '7',
    name: 'Praia do Paiva',
    neighborhood: 'Paiva',
    status: 'safe',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -8.2489, lng: -34.9567 },
    description: 'Praia semi-deserta com natureza preservada.',
    amenities: ['Estacionamento', 'Área natural'],
    waveHeight: 1.2,
    sharkRisk: 'medium',
    waterTemperature: 26,
    coliformLevel: 'normal',
  },
  {
    id: '8',
    name: 'Praia de Maria Farinha',
    neighborhood: 'Maria Farinha',
    status: 'safe',
    lastUpdate: '2024-12-08T08:00:00',
    coordinates: { lat: -7.8534, lng: -34.8234 },
    description: 'Praia com águas calmas, ideal para famílias.',
    amenities: ['Piscinas naturais', 'Quiosques', 'Estacionamento'],
    waveHeight: 0.3,
    sharkRisk: 'low',
    waterTemperature: 28,
    coliformLevel: 'normal',
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
    title: 'CPRH: Risco de tubarões em Piedade permanece moderado',
    summary: 'Monitoramento contínuo na área. Evite banho após 16h e em dias nublados.',
    date: '2024-12-06',
    category: 'alert',
  },
  {
    id: '4',
    title: 'Atenção: Praia de Candeias imprópria para banho',
    summary: 'Níveis elevados de coliformes detectados. CPRH recomenda evitar a área.',
    date: '2024-12-05',
    category: 'alert',
  },
  {
    id: '5',
    title: 'Ondas podem chegar a 1.5m em Piedade e Paiva',
    summary: 'Marinha alerta para mar agitado no litoral sul da RMR nesta semana.',
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
