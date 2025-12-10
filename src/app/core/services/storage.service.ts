import { Injectable } from '@angular/core';
import { Partida } from '../../models/partida';
import { Usuario } from '../../models/usuario';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private prefixo = 'historico_partidas_';
  private sessionKey = 'app_session';

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
      // usa id ou email
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
    lista.unshift(partida);
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
