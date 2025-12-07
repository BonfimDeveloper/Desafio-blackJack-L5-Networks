import { Suit } from './suit';

export class Card {
  constructor(
    public id: number,
    public rank: string,
    public suit: Suit,
    public faceUp: boolean = false
  ) {}
}
