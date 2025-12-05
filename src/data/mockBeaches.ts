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
}

export const beaches: Beach[] = [
  {
    id: '1',
    name: 'Praia de Boa Viagem',
    neighborhood: 'Boa Viagem',
    status: 'safe',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -8.1193, lng: -34.8953 },
    description: 'Uma das praias mais famosas do Recife, com extensa faixa de areia e águas mornas.',
    amenities: ['Quiosques', 'Chuveiros', 'Salva-vidas', 'Estacionamento'],
  },
  {
    id: '2',
    name: 'Praia do Pina',
    neighborhood: 'Pina',
    status: 'warning',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -8.0928, lng: -34.8756 },
    description: 'Praia urbana próxima ao centro, com bela vista da cidade.',
    amenities: ['Quiosques', 'Restaurantes', 'Ciclovia'],
  },
  {
    id: '3',
    name: 'Praia de Piedade',
    neighborhood: 'Piedade',
    status: 'safe',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -8.1544, lng: -34.9161 },
    description: 'Praia tranquila no município de Jaboatão dos Guararapes.',
    amenities: ['Quiosques', 'Estacionamento', 'Salva-vidas'],
  },
  {
    id: '4',
    name: 'Praia de Candeias',
    neighborhood: 'Candeias',
    status: 'danger',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -8.1756, lng: -34.9267 },
    description: 'Praia com piscinas naturais formadas pelos recifes.',
    amenities: ['Quiosques', 'Restaurantes'],
  },
  {
    id: '5',
    name: 'Praia de Barra de Jangada',
    neighborhood: 'Barra de Jangada',
    status: 'safe',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -8.2167, lng: -34.9433 },
    description: 'Encontro do rio com o mar, paisagem única e passeios de jangada.',
    amenities: ['Passeio de jangada', 'Restaurantes', 'Pesca'],
  },
  {
    id: '6',
    name: 'Praia de Casa Caiada',
    neighborhood: 'Casa Caiada',
    status: 'warning',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -7.9856, lng: -34.8456 },
    description: 'Praia com calçadão e área de lazer em Olinda.',
    amenities: ['Calçadão', 'Quiosques', 'Área de lazer'],
  },
  {
    id: '7',
    name: 'Praia do Paiva',
    neighborhood: 'Paiva',
    status: 'safe',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -8.2489, lng: -34.9567 },
    description: 'Praia semi-deserta com natureza preservada.',
    amenities: ['Estacionamento', 'Área natural'],
  },
  {
    id: '8',
    name: 'Praia de Maria Farinha',
    neighborhood: 'Maria Farinha',
    status: 'safe',
    lastUpdate: '2024-01-15T08:00:00',
    coordinates: { lat: -7.8534, lng: -34.8234 },
    description: 'Praia com águas calmas, ideal para famílias.',
    amenities: ['Piscinas naturais', 'Quiosques', 'Estacionamento'],
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
    date: '2024-01-15',
    category: 'weather',
  },
  {
    id: '2',
    title: 'Praias de Boa Viagem apresentam condições ideais',
    summary: 'Análise da CPRH confirma águas próprias para banho na região.',
    date: '2024-01-14',
    category: 'news',
  },
  {
    id: '3',
    title: 'Mutirão de limpeza nas praias do Recife',
    summary: 'Voluntários se unem para coletar resíduos e preservar o litoral.',
    date: '2024-01-13',
    category: 'news',
  },
  {
    id: '4',
    title: 'Atenção: Praia de Candeias imprópria para banho',
    summary: 'Devido às últimas chuvas, recomenda-se evitar o banho nesta área.',
    date: '2024-01-12',
    category: 'alert',
  },
  {
    id: '5',
    title: 'Projeto de monitoramento em tempo real será lançado',
    summary: 'Nova tecnologia permitirá acompanhar qualidade da água instantaneamente.',
    date: '2024-01-11',
    category: 'news',
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
