import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { v4 as uuid } from 'uuid';
import { AuthService } from './auth.service';
import { ResultadoJogo } from '../../models/resultadoJogo';

@Injectable({ providedIn: 'root' })
export class BlackjackService {
  deck = signal<number[]>([]);
  player = signal<number[]>([]);
  dealer = signal<number[]>([]);
  message = signal<string>('');
  private HISTORY_KEY = 'game_history';

  constructor(private storage: StorageService, private auth: AuthService) {
    this.resetarJogo();
  }

  private criarDeck() {
    const newDeck: number[] = [];
    for (let v = 1; v <= 11; v++) {
      for (let i = 0; i < 4; i++) newDeck.push(v);
    }
    this.deck.set(this.EmbaralharCartas(newDeck));
  }

  private EmbaralharCartas<T>(arr: T[]) {
    return arr
      .map((a) => ({ a, r: Math.random() }))
      .sort((x, y) => x.r - y.r)
      .map((z) => z.a);
  }

  /*  remove e retorna
  a próxima carta do baralho
  */
  private removerEretornarProximaCarta() {
    const d = this.deck();
    const c = d.pop()!;
    this.deck.set(d);
    return c;
  }

  resetarJogo() {
    this.criarDeck();
    this.player.set([]);
    this.dealer.set([]);
    this.dealer.update((s) => [...s, this.removerEretornarProximaCarta()]);
    this.player.update((s) => [
      ...s,
      this.removerEretornarProximaCarta(),
      this.removerEretornarProximaCarta(),
    ]);
    this.message.set('');
  }

  pedirCarta() {
    this.player.update((s) => [...s, this.removerEretornarProximaCarta()]);
    const total = this.total(this.player());
    if (total > 21) this.fimDeJogo();
    if (total === 21) {
      this.pararDePedirCartas();
    }
  }

  pararDePedirCartas() {
    while (this.total(this.dealer()) < 17) {
      this.dealer.update((s) => [...s, this.removerEretornarProximaCarta()]);
    }
    this.fimDeJogo();
  }

  private total(cards: number[]) {
    return cards.reduce((a, b) => a + b, 0);
  }

  private fimDeJogo() {
    const p = this.total(this.player());
    const d = this.total(this.dealer());
    let result: 'VITÓRIA' | 'DERROTA' | 'EMPATE' = 'DERROTA';

    if (p > 21) result = 'DERROTA';
    else if (d > 21) result = 'VITÓRIA';
    else if (p === d) result = 'DERROTA'; // conforme regra do enunciado empate = derrota
    else result = p > d ? 'VITÓRIA' : 'DERROTA';

    this.message.set(
      result === 'VITÓRIA'
        ? 'Você venceu!'
        : result === 'DERROTA'
        ? 'Dealer venceu'
        : 'Empate - considerado derrota'
    );

    // persistir histórico se usuário logado
    const user = this.auth.user();
    if (user) {
      const history = this.storage.get<ResultadoJogo[]>(this.HISTORY_KEY) ?? [];
      const game: ResultadoJogo = {
        id: uuid(),
        userId: user.id,
        playerCards: this.player(),
        dealerCards: this.dealer(),
        playerTotal: p,
        dealerTotal: d,
        result,
        date: new Date().toISOString(),
      };
      history.unshift(game);
      this.storage.set(this.HISTORY_KEY, history);
      this.auth.updateStats(user.id, result === 'VITÓRIA');
    }
  }

  resgatarHistoricoParaUsuarios(userId: string) {
    const history = this.storage.get<ResultadoJogo[]>(this.HISTORY_KEY) ?? [];
    return history.filter((h) => h.userId === userId);
  }
}
