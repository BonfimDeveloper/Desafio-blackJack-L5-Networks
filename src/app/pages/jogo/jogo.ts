import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Baralho } from '../../shared/components/baralho/baralho';
import { Card } from '../../models/card';
import { PlayingCard } from '../../shared/components/playing-card/playing-card';

@Component({
  selector: 'app-jogo',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, Baralho, PlayingCard],
  templateUrl: './jogo.html',
  styleUrl: './jogo.css',
})
export class Jogo {
  maoJogador: Card[] = [];
  maoDealer: Card[] = [];

  // flag simples só para o exemplo — você pode controlar via lógica do jogo
  vezDoJogador = true;

  onCardDrawn(event: Card | null): void {
    if (!event) {
      console.log('Baralho vazio — não foi possível puxar carta.');
      return;
    }

    // virar a carta para exibição
    event.faceUp = true;

    if (this.vezDoJogador) {
      this.maoJogador.push(event);
      console.log('Carta adicionada na mão do jogador:', event);
    } else {
      this.maoDealer.push(event);
      console.log('Carta adicionada na mão do dealer:', event);
    }

    // exemplo: alterna a vez (apenas ilustrativo)
    this.vezDoJogador = !this.vezDoJogador;
  }

  getPontuacao(mao: Card[]): number {
    let total = 0;
    let ases = 0;

    for (const c of mao) {
      if (c.rank === 'A') {
        ases++;
        total += 11;
      } else if (['J', 'Q', 'K'].includes(c.rank)) total += 10;
      else total += Number(c.rank);
    }

    // ajusta ases (11 → 1 quando necessário)
    while (total > 21 && ases > 0) {
      total -= 10;
      ases--;
    }

    //   <div class="count-indicator">
    //   {{ getPontuacao(maoJogador) }}
    // </div>

    return total;
  }

  onPass() {
    console.log('Passar');
  }

  onDraw() {
    console.log('Pedir');
  }
}
