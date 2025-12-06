import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './core/guards/auth.guard';
import { Jogo } from './pages/jogo/jogo';
import { Historico } from './pages/historico/historico';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'game', component: Jogo, canActivate: [AuthGuard] },
  { path: 'history', component: Historico, canActivate: [AuthGuard] },
];
