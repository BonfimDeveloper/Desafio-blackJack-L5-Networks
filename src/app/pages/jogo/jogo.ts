import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Baralho } from '../../shared/components/baralho/baralho';
import { Card } from '../../models/card';
import { PlayingCard } from '../../shared/components/playing-card/playing-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '../../shared/components/dialog/dialog';

@Component({
  selector: 'app-jogo',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    Baralho,
    PlayingCard,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './jogo.html',
  styleUrl: './jogo.css',
})
export class Jogo {
  @ViewChild('baralhoRef') baralho!: Baralho;
  modalRef!: MatDialogRef<Dialog>;
  maoJogador: Card[] = [];
  maoDealer: Card[] = [];
  mensagemFinal: string = '';
  maxCartasJogador = 11;
  cartasJogador: Card[] = [];
  vezDoJogador = true;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.abrirModalInicio();
  }

  abrirModalInicio() {
    this.modalRef = this.dialog.open(Dialog, {
      width: '2000px',
      disableClose: true,
    });

    // 👉 escutando fechamento
    this.modalRef.afterClosed().subscribe(() => {
      this.distribuirCartasIniciais();
      console.log('Modal foi fechado');
    });
  }

  fecharModalInicio() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  private distribuirCartasIniciais() {
    // limpa mãos antes de distribuir
    this.maoJogador = [];
    this.maoDealer = [];
    this.vezDoJogador = true;

    // JOGADOR → 2 cartas viradas pra cima
    this.baralho.draw(true);
    this.baralho.draw(true);

    // DEALER → 1 carta cima, 1 carta baixo
    this.vezDoJogador = false; // força próxima carta ser do dealer
    this.baralho.draw(true); // primeira carta do dealer (face up)

    this.baralho.draw(false); // segunda carta do dealer (face down)

    // devolve a vez pro jogador
    this.vezDoJogador = true;
  }
  get totalCartasJogador(): number {
    return this.maoJogador.length;
  }

  get jogadorPodePedir(): boolean {
    return this.maoJogador.length < 11;
  }

  onCardDrawn(event: Card | null): void {
    if (!event) return;

    // 1. JOGADOR
    if (this.vezDoJogador) {
      this.maoJogador = [...this.maoJogador, event];

      const totalJog = this.getPontuacao(this.maoJogador);

      // estourou → perde na hora
      if (totalJog > 21) {
        this.vezDoJogador = false;
        this.fimDeJogo('dealer');
        return;
      }

      // se o jogador parar de pedir, dealer joga
      if (!this.jogadorPodePedir) {
        this.vezDoJogador = false;
        setTimeout(() => this.jogadaDealer(), 600);
        return;
      }

      return;
    }

    // DEALER
    else {
      const isPrimeiraCartaDealer = this.maoDealer.length === 0;
      event.faceUp = isPrimeiraCartaDealer ? true : false;

      this.maoDealer = [...this.maoDealer, event];

      const totalDealer = this.getPontuacao(this.maoDealer);

      // dealer estourou
      if (totalDealer > 21) {
        this.fimDeJogo('jogador');
        return;
      }

      return;
    }
  }

  jogadaDealer() {
    const totalJogador = this.getPontuacao(this.maoJogador);

    const loop = () => {
      const totalDealer = this.getPontuacao(this.maoDealer);

      // dealer deve comprar se:
      const deveComprar = totalDealer < 17 || (totalDealer < totalJogador && totalJogador <= 21);

      if (deveComprar) {
        this.vezDoJogador = false;
        this.baralho.draw(true); // dealer sempre vira pra cima
        setTimeout(loop, 100);
        return;
      }

      // dealer decide parar
      this.fimDeJogo();
    };

    loop();
  }

  fimDeJogo(vencedor?: 'jogador' | 'dealer') {
    const totalJog = this.getPontuacao(this.maoJogador);
    const totalDeal = this.getPontuacao(this.maoDealer);

    if (vencedor === 'jogador') {
      this.mensagemFinal = 'Você venceu! Dealer estourou.';
      alert(this.mensagemFinal);
      return;
    }

    if (vencedor === 'dealer') {
      this.mensagemFinal = 'Dealer venceu! Você estourou.';
      alert(this.mensagemFinal);

      return;
    }

    if (totalJog === totalDeal) {
      this.mensagemFinal = 'Dealer venceu.';
    }

    if (totalJog > totalDeal) {
      this.mensagemFinal = 'Você venceu!';
      alert(this.mensagemFinal);

      return;
    }

    if (totalDeal > totalJog) {
      this.mensagemFinal = 'Dealer venceu!';
      alert(this.mensagemFinal);

      return;
    }

    // empate configura vitória do dealer
    if (totalDeal === totalJog) {
      this.mensagemFinal = 'Empate — Dealer vence pela regra da banca';
      alert(this.mensagemFinal);
    }
  }

  getPontuacao(mao: Card[]): number {
    let total = 0;
    let ases = 0;

    for (const c of mao) {
      if (c.rank === 'A') {
        ases++;
        total += 11;
      } else if (['J', 'Q', 'K'].includes(c.rank)) {
        total += 10;
      } else {
        total += Number(c.rank);
      }
    }

    while (total > 21 && ases > 0) {
      total -= 10;
      ases--;
    }

    return total;
  }

  revelarCartasDealer() {
    this.maoDealer = this.maoDealer.map((c) => ({ ...c, faceUp: true }));
  }

  onPass() {
    this.vezDoJogador = false;
    setTimeout(() => this.jogadaDealer(), 600);
  }

  pedirCarta() {
    if (!this.baralho) return;
    if (!this.jogadorPodePedir) return;

    this.baralho.draw(true); // vira sempre pra cima
  }

  get contadorCartas() {
    return `${this.cartasJogador.length}/${this.maxCartasJogador}`;
  }
}
