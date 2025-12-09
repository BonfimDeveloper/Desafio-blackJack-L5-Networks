export interface Partida {
  jogador: any[]; // suas cartas
  dealer: any[]; // cartas do dealer
  resultado: 'VITÓRIA' | 'DERROTA' | 'EMPATE';
  data: string; // ex: "25/08/2023 14:30"
}
