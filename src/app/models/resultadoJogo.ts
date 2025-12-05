export interface ResultadoJogo {
  id: string;
  userId: string;
  playerCards: number[];
  dealerCards: number[];
  playerTotal: number;
  dealerTotal: number;
  result: 'VITÓRIA' | 'DERROTA' | 'EMPATE';
  date: string; // ISO
}
