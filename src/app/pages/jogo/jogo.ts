import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-jogo',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './jogo.html',
  styleUrl: './jogo.css',
})
export class Jogo {
  onPass() {
    console.log('Passar');
  }

  onDraw() {
    console.log('Pedir');
  }
}
