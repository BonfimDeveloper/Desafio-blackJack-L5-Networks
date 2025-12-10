import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vitoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitoria.html',
  styleUrl: './vitoria.css',
})
export class Vitoria {
  @Input() pontuacaoFinal: number = 0;
  @Output() jogarNovamente = new EventEmitter<void>();

  // Array para gerar os confetes dinamicamente (para mais realismo)
  confettiPieces: any[] = Array(50).fill(0);

  ngOnInit(): void {}

  onReset() {
    this.jogarNovamente.emit();
  }

  // Função utilitária para cores aleatórias dos confetes
  getRandomColor(): string {
    const colors = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#ffeb3b',
      '#ff9800',
      '#ff5722',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Posição aleatória para simular explosão
  getRandomStyle() {
    return {
      left: Math.random() * 100 + 'vw',
      animationDelay: Math.random() * 2 + 's',
      backgroundColor: this.getRandomColor(),
      transform: `scale(${0.5 + Math.random() * 0.5}) rotate(${Math.random() * 360}deg)`,
    };
  }
}
