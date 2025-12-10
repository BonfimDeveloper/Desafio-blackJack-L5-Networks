import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-derrota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './derrota.html',
  styleUrl: './derrota.css',
})
export class Derrota {
  @Input() pontuacaoFinal: number = 0;
  @Output() jogarNovamente = new EventEmitter<void>();

  // Flag para controlar a animação e o display
  animar: boolean = false;

  ngOnInit(): void {
    // Inicia a animação
    this.animar = true;
  }

  onReset() {
    this.jogarNovamente.emit();
  }
}
