import { ChangeDetectorRef, Component } from '@angular/core';
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
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

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
    private loader: LoaderService,
    private cd: ChangeDetectorRef
  ) {}

  public logarUsuario(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email!;

    this.loader.show();

    try {
      this.auth.login(email);
      this.toast.success('Login realizado com sucesso!');
      this.router.navigate(['/dashboard']);
      this.loader.hide();
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao fazer login');
      this.loader.hide();
    } finally {
      this.loader.hide();
    }
  }

  public cadastrarUsuario(): void {
    this.loader.show();
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.loader.hide();

      return;
    }

    const email = this.cadastroForm.value.email!;
    const nome = this.cadastroForm.value.nome!;

    try {
      this.auth.register(email, nome);
      this.toast.success('Usuário cadastrado!');
      setTimeout(() => {
        this.acessar = true;
        this.cadastrar = false;
        this.loader.hide();
        this.cd.detectChanges();
      }, 2000);
    } catch (err: any) {
      console.error(err.message);
      this.loader.hide();
    }
  }

  onClickAcessar() {
    this.acessar = true;
  }

  onClickVoltar() {
    this.acessar = false;
    this.cadastrar = false;
  }

  onClickCadastrar() {
    this.acessar = false;
    this.cadastrar = true;
  }

  navegarParaDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
