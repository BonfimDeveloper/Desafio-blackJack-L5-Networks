// import { Injectable } from '@angular/core';
// import { Partida } from '../../models/partida';

// @Injectable({ providedIn: 'root' })
// export class StorageService {
//   private chave = 'historico_partidas';

//   private prefixo = 'historico_partidas_';

//   get<T>(key: string): T | null {
//     const v = localStorage.getItem(key);
//     return v ? (JSON.parse(v) as T) : null;
//   }
//   set<T>(key: string, value: T) {
//     localStorage.setItem(key, JSON.stringify(value));
//   }
//   remove(key: string) {
//     localStorage.removeItem(key);
//   }

//   private getChaveUsuario(): string {
//     const usuario = JSON.parse(localStorage.getItem('app_session')!);

//     if (!usuario) {
//       console.warn('Nenhum usuário logado encontrado ao acessar StorageService');
//       return this.prefixo + 'desconhecido';
//     }

//     return this.prefixo + usuario.id; // ou usuario.email
//   }
//   private ler(): Partida[] {
//     const chave = this.getChaveUsuario();
//     const dados = sessionStorage.getItem(this.chave);
//     return dados ? JSON.parse(dados) : [];
//   }

//   private salvar(lista: Partida[]) {
//     const chave = this.getChaveUsuario();
//     sessionStorage.setItem(this.chave, JSON.stringify(lista));
//   }

//   registrarPartida(partida: Partida) {
//     const lista = this.ler();
//     lista.unshift(partida); // coloca no topo
//     this.salvar(lista);
//   }

//   listarPartidas(): Partida[] {
//     return this.ler();
//   }

//   limparHistorico() {
//     const chave = this.getChaveUsuario();
//     sessionStorage.removeItem(this.chave);
//   }
// }

import { Injectable } from '@angular/core';
import { Partida } from '../../models/partida';
import { Usuario } from '../../models/usuario';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private prefixo = 'historico_partidas_';
  private sessionKey = 'app_session'; // mesmo valor do AuthService.SESSION_KEY

  // métodos genéricos para localStorage (já existentes)
  get<T>(key: string): T | null {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  }
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string) {
    localStorage.removeItem(key);
  }

  // --- histórico por usuário usando sessionStorage ---
  private getChaveUsuario(): string {
    try {
      const s = localStorage.getItem(this.sessionKey);
      if (!s) return this.prefixo + 'anon';
      const usuario: Usuario = JSON.parse(s);
      // usa id quando disponível, senão email, senão 'anon'
      const id = usuario?.id ?? usuario?.email ?? 'anon';
      return this.prefixo + id;
    } catch {
      return this.prefixo + 'anon';
    }
  }

  private ler(): Partida[] {
    const chave = this.getChaveUsuario();
    const dados = sessionStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  }

  private salvar(lista: Partida[]) {
    const chave = this.getChaveUsuario();
    sessionStorage.setItem(chave, JSON.stringify(lista));
  }

  registrarPartida(partida: Partida) {
    const lista = this.ler();
    lista.unshift(partida); // coloca no topo
    this.salvar(lista);
  }

  listarPartidas(): Partida[] {
    return this.ler();
  }

  limparHistorico() {
    const chave = this.getChaveUsuario();
    sessionStorage.removeItem(chave);
  }
}
