import { Injectable } from '@angular/core';
import { Partida } from '../../models/partida';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private chave = 'historico_partidas';

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

  private ler(): Partida[] {
    const dados = sessionStorage.getItem(this.chave);
    return dados ? JSON.parse(dados) : [];
  }

  private salvar(lista: Partida[]) {
    sessionStorage.setItem(this.chave, JSON.stringify(lista));
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
    sessionStorage.removeItem(this.chave);
  }
}
