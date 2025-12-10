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
  @Input() faceUp?: boolean;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get colorClass(): string {
    return this.card.suit === '♥' || this.card.suit === '♦' ? 'red' : 'black';
  }

  get isFaceUp(): boolean {
    return this.faceUp !== undefined ? this.faceUp : !!this.card?.faceUp;
  }

  get suitSymbol(): string {
    const s = this.card?.suit;
    if (!s) return '';
    // se já for símbolo, retorna direto
    if (['♠', '♥', '♦', '♣'].includes(s as any)) return s as any;
    // aceita strings 'hearts' etc
    const suitMap: Record<string, string> = {
      hearts: '♥',
      diamonds: '♦',
      spades: '♠',
      clubs: '♣',
    };
    return suitMap[(s as string).toLowerCase()] ?? (s as any);
  }
}
