import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
/*
UUID  para gerar identificadores únicos,
ou seja, códigos que nunca se repetem,
mesmo que gerados em sistemas diferentes.
*/
import { v4 as uuid } from 'uuid';
import { Usuario } from '../../models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<Usuario | null>(null);
  private USERS_KEY = 'app_users';
  private SESSION_KEY = 'app_session';

  constructor(private storage: StorageService) {
    const session = this.storage.get<Usuario>(this.SESSION_KEY);
    if (session) this.user.set(session);
  }

  register(email: string, name: string) {
    const users = this.storage.get<Usuario[]>(this.USERS_KEY) ?? [];
    if (users.find((u) => u.email === email)) throw new Error('Email já cadastrado');
    const u: Usuario = {
      id: uuid(),
      email,
      name,
      stats: { wins: 0, losses: 0, games: 0 },
    };
    users.push(u);
    this.storage.set(this.USERS_KEY, users);
    this.login(email);
  }

  login(email: string) {
    const users = this.storage.get<Usuario[]>(this.USERS_KEY) ?? [];
    const u = users.find((x) => x.email === email);
    if (!u) throw new Error('Credenciais inválidas');
    this.user.set({ ...u });
    this.storage.set(this.SESSION_KEY, u);
  }

  logout() {
    this.user.set(null);
    this.storage.remove(this.SESSION_KEY);
  }

  updateStats(userId: string, isWin: boolean) {
    const users = this.storage.get<Usuario[]>(this.USERS_KEY) ?? [];
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return;
    const st = users[idx].stats ?? { wins: 0, losses: 0, games: 0 };
    st.games++;
    if (isWin) st.wins++;
    else st.losses++;
    users[idx].stats = st;
    this.storage.set(this.USERS_KEY, users);
    if (this.user() && this.user()!.id === userId) this.user.set({ ...users[idx] });
  }
}
