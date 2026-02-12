
export enum UserCategory {
  TRAVELING = 'Traveling',
  BACK_TO_SCHOOL = 'Back to School',
  UMRAH_IBADAH = 'Umrah & Ibadah',
  KANTORAN = 'Kantoran',
  HANGOUT = 'Hangout'
}

export interface Marker {
  id: string;
  lat: number;
  lng: number;
  userName: string;
  category: UserCategory;
  timestamp: number;
  cityName?: string;
}

export interface UserStats {
  name: string;
  email: string;
  category: UserCategory;
  totalKm: number;
  streak: number;
  lastUpdate: number;
  visitedCities: string[];
  voucherCode?: string;
  currentProduct?: {
    name: string;
    category: string;
    image: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  category: UserCategory;
  km: number;
  streak: number;
}
