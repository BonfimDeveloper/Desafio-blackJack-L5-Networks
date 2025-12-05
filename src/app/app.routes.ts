import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard },

  // { path: 'register', component: RegisterComponent },
  // { path: 'game', component: GameComponent, canActivate: [AuthGuard] },
  // { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] }
];
