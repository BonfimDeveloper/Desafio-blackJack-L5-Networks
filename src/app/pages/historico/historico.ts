import { Component, OnInit } from '@angular/core';
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
export class Historico implements OnInit {
  partidas: Partida[] = [];

  // Variáveis de Paginação
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  paginatedPartidas: any[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.partidas = this.storage.listarPartidas();
    this.calcularPaginacao();
  }

  calcularPaginacao(): void {
    // Calcula o número total de páginas
    this.totalPages = Math.ceil(this.partidas.length / this.itemsPerPage);

    // Define o índice de início e fim para o método slice()
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Filtra apenas as partidas da página atual
    this.paginatedPartidas = this.partidas.slice(startIndex, endIndex);
  }

  // Navega para um número de página específico.

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calcularPaginacao();
    }
  }

  // Navega para a próxima página.

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.calcularPaginacao();
    }
  }

  // Navega para a página anterior.

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.calcularPaginacao();
    }
  }

  /**
   * Retorna um array de números para o *ngFor no HTML gerar os botões.
   * Ex: Se totalPages for 4, retorna [1, 2, 3, 4]
   */
  get pageNumbers(): number[] {
    // Se não houver páginas (partidas), retorna um array vazio
    if (this.totalPages === 0) return [];

    // Cria um array de 0s com o tamanho de totalPages e mapeia para 1, 2, 3...
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
}
