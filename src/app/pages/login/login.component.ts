import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../core/services/toast.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../core/services/loader.service';

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
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginComponent {
  cadastroForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  email: string = '';
  nome: string = '';

  acessar: boolean = false;
  cadastrar: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private loader: LoaderService
  ) {}

  onSubmit() {
    this.loader.show();
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const email = this.cadastroForm.value.email!;
    const nome = this.cadastroForm.value.nome!;

    try {
      this.auth.register(email, nome);
      console.log('Usuário cadastrado com sucesso!');
      this.toast.success('Usuário cadastrado!');
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
        this.loader.hide();
      }, 2000);
    } catch (err: any) {
      console.error(err.message);
      // exibir erro no template
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
