export interface Usuario {
  id: string;
  email: string;
  name: string;
  password?: string; // somente para mock/local
  stats?: {
    wins: number;
    losses: number;
    games: number;
  };
}
