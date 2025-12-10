import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../../models/card';
import { Suit } from '../../../models/suit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-baralho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './baralho.html',
  styleUrl: './baralho.css',
})
export class Baralho {
  // tamanho fixo das cartas em pixels
  readonly cardWidth = 97;
  readonly cardHeight = 115;

  // controla se clicar no baralho irá puxar uma carta
  @Input() clickable = true;

  // tamanho inicial do baralho (padrão 52 cartas)
  @Input() useJokers = false;

  // emite o evento com a carta puxada (virada ou não, conforme parâmetro)
  @Output() cardDrawn = new EventEmitter<Card | null>();

  private nextId = 1;
  cards: Card[] = [];

  constructor() {
    this.reset();
  }

  // visualStack controla quantas cartas sobrepostas são exibidas para formar o visual do baralho
  get visualStack(): number[] {
    const count = Math.min(6, this.cards.length);
    return Array(count).fill(0);
  }

  // cria um baralho padrão de 52 cartas
  private buildDeck(): Card[] {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits: Suit[] = ['♠', '♥', '♦', '♣'];
    const out: Card[] = [];
    for (const s of suits) {
      for (const r of ranks) {
        out.push({ id: this.nextId++, rank: r, suit: s, faceUp: false });
      }
    }
    if (this.useJokers) {
      out.push({ id: this.nextId++, rank: 'JOKER', suit: '♠', faceUp: false });
      out.push({ id: this.nextId++, rank: 'JOKER', suit: '♣', faceUp: false });
    }
    return out;
  }

  // embaralha o baralho (algoritmo Fisher-Yates)
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // reinicia o baralho completo e embaralhado
  reset() {
    this.cards = this.buildDeck();
    this.shuffle();
  }

  // puxa uma carta: remove do baralho e emite o evento
  draw(faceUp = false): Card | null {
    if (this.cards.length === 0) {
      this.cardDrawn.emit(null);
      return null;
    }
    const c = this.cards.pop() as Card;
    c.faceUp = faceUp;
    this.cardDrawn.emit(c);
    return c;
  }

  // calcula pequenos deslocamentos para criar o efeito visual de cartas empilhadas
  computeStackTransform(index: number): string {
    const dx = index * 0.9;
    const dy = index * 0.6;
    const r = index % 2 === 0 ? -0.6 * index : 0.6 * index;
    return `translate(${dx}px, ${dy}px) rotate(${r}deg)`;
  }
}
