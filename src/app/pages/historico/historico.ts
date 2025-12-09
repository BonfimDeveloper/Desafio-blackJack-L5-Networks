import { Component } from '@angular/core';
import { Partida } from '../../models/partida';
import { StorageService } from '../../core/services/storage.service';
import { PlayingCard } from '../../shared/components/playing-card/playing-card';
import { CommonModule } from '@angular/common';
import { DataFormatPipe } from '../../shared/pipes/data-format.pipe';
import { ButtonBackDashboard } from '../../shared/components/button-back-dashboard/button-back-dashboard';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, PlayingCard, DataFormatPipe, ButtonBackDashboard],
  templateUrl: './historico.html',
  styleUrl: './historico.css',
})
export class Historico {
  partidas: Partida[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.partidas = this.storage.listarPartidas();
  }
}
