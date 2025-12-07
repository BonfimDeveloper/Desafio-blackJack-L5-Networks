import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
  @ViewChild('baralhoRef') baralho!: Baralho;
  maoJogador: Card[] = [];
  maoDealer: Card[] = [];

  maxCartasJogador = 11;

  cartasJogador: Card[] = [];

  // flag simples só para o exemplo — você pode controlar via lógica do jogo
  vezDoJogador = true;

  get totalCartasJogador(): number {
    return this.maoJogador.length;
  }

  get jogadorPodePedir(): boolean {
    return this.maoJogador.length < 11;
  }

  // onCardDrawn(event: Card | null): void {
  //   if (!event) {
  //     console.log('Baralho vazio — não foi possível puxar carta.');
  //     return;
  //   }

  //   event.faceUp = true;

  //   if (this.vezDoJogador) {
  //     this.maoJogador.push(event);
  //     console.log('Carta adicionada na mão do jogador:', event);
  //   } else {
  //     this.maoDealer.push(event);
  //     console.log('Carta adicionada na mão do dealer:', event);
  //   }

  //   this.vezDoJogador = !this.vezDoJogador;
  // }

  onCardDrawn(event: Card | null): void {
    if (!event) {
      console.log('Baralho vazio — não foi possível puxar carta.');
      return;
    }

    // virar a carta para exibição
    event.faceUp = true;

    // **JOGADOR**
    if (this.vezDoJogador) {
      // impede o jogador de ultrapassar 11 cartas
      if (this.totalCartasJogador >= this.maxCartasJogador) {
        console.warn('Limite de cartas atingido (11).');
        return;
      }

      // atribuição imutável para garantir atualização visual
      this.maoJogador = [...this.maoJogador, event];
      console.log('Carta adicionada na mão do jogador:', event);
    }

    // **DEALER**
    else {
      const isPrimeiraCartaDealer = this.maoDealer.length === 0;

      event.faceUp = isPrimeiraCartaDealer ? true : false;
      this.maoDealer = [...this.maoDealer, event];
      console.log('Carta adicionada na mão do dealer:', event);
    }

    // troca de vez (caso queira manter)
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

  revelarCartasDealer() {
    this.maoDealer = this.maoDealer.map((c) => ({ ...c, faceUp: true }));
  }

  onPass() {
    console.log('Passar');
  }

  pedirCarta() {
    if (!this.jogadorPodePedir) return;

    // puxa carta do baralho SEM virar
    this.baralho.draw(false);
  }

  get contadorCartas() {
    return `${this.cartasJogador.length}/${this.maxCartasJogador}`;
  }
}
