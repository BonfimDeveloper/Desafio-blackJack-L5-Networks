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
  constructor(private auth: AuthService, private router: Router, private loader: LoaderService) {}

  //Navega para página de visualização do histórico das partidas
  public visualizarHistorico(): void {
    this.loader.show();

    setTimeout(() => {
      this.router.navigate(['/login']);
      this.loader.hide();
    }, 1000);
    console.log('funcionou view');
  }

  //Navega para a página do jogo
  public navegarParaJogo(): void {
    this.loader.show();

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
      this.loader.hide();
    }, 1000);
  }
}
