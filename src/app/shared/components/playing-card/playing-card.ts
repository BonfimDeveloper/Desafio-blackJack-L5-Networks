import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from '../../../models/card';

@Component({
  selector: 'app-playing-card',
  imports: [CommonModule],
  templateUrl: './playing-card.html',
  styleUrl: './playing-card.css',
})
export class PlayingCard {
  @Input() card!: Card;
  @Input() faceUp = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get colorClass(): string {
    return this.card.suit === '♥' || this.card.suit === '♦' ? 'red' : 'black';
  }

  /** Converte suit textual para símbolo */
  get suitSymbol(): string {
    const suitMap: any = {
      hearts: '♥',
      diamonds: '♦',
      spades: '♠',
      clubs: '♣',
    };

    return suitMap[this.card.suit] || this.card.suit;
  }
}
