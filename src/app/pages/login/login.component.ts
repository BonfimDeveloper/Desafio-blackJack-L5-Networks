import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LoginComponent {
  email: string = '';
  nome: string = '';

  acessar: boolean = false;
  cadastrar: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    try {
      this.auth.login(this.email);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      //alert(e.message);
    }
  }

  onClickAcessar() {
    this.acessar = true;

    console.log(this.acessar);
  }

  onClickVoltar() {
    this.acessar = false;
    this.cadastrar = false;

    console.log(this.acessar);
  }

  onClickCadastrar() {
    this.acessar = false;
    this.cadastrar = true;
    console.log(this.cadastrar);
  }

  navegarParaDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
