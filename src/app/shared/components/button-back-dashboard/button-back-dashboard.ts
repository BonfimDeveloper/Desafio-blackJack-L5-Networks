import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-back-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './button-back-dashboard.html',
  styleUrl: './button-back-dashboard.css',
})
export class ButtonBackDashboard {
  constructor(private router: Router) {}

  voltar() {
    this.router.navigate(['/dashboard']); // ajuste sua rota se for diferente
  }
}
