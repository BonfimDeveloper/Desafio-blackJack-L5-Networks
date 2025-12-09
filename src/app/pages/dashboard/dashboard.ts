import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../core/services/loader.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  estatisticas = {
    total: 0,
    vitorias: 0,
    derrotas: 0,
  };
  constructor(
    public auth: AuthService,
    private router: Router,
    private loader: LoaderService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.calcularEstatisticas();
  }

  //Navega para página de visualização do histórico das partidas
  public visualizarHistorico(): void {
    this.loader.show();

    setTimeout(() => {
      this.router.navigate(['/history']);
      this.loader.hide();
    }, 1000);
    console.log('funcionou view');
  }

  //Navega para a página do jogo
  public navegarParaJogo(): void {
    this.loader.show();

    setTimeout(() => {
      this.router.navigate(['/game']);
      this.loader.hide();
    }, 1000);
  }

  calcularEstatisticas() {
    const partidas = this.storage.listarPartidas();

    const vitorias = partidas.filter((p) => p.resultado === 'VITÓRIA').length;
    const derrotas = partidas.filter((p) => p.resultado === 'DERROTA').length;

    this.estatisticas = {
      total: partidas.length,
      vitorias,
      derrotas,
    };
  }
}
