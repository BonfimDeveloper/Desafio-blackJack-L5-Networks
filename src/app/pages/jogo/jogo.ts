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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderService } from '../../core/services/loader.service';
import { ToastService } from '../../core/services/toast.service';
import { StorageService } from '../../core/services/storage.service';
import { ButtonBackDashboard } from '../../shared/components/button-back-dashboard/button-back-dashboard';

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
    MatSnackBarModule,
    ButtonBackDashboard,
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
  mostraCartaDealerFimJogo: Boolean = false;

  constructor(
    private dialog: MatDialog,
    private loader: LoaderService,
    private toast: ToastService,
    private storage: StorageService
  ) {}

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

      this.mostraCartaDealerFimJogo = event.faceUp;

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
    this.revelarCartasDealer();
    this.registrarPartidaNoHistorico();

    const totalJog = this.getPontuacao(this.maoJogador);
    const totalDeal = this.getPontuacao(this.maoDealer);

    // 1. Vitória direta por estourar
    if (vencedor === 'jogador') {
      this.toast.success('Você venceu! Dealer estourou.');
      return;
    }

    if (vencedor === 'dealer') {
      this.toast.error('Dealer venceu! Você estourou.');
      return;
    }

    // 2. Blackjack imediato
    if (totalJog === 21 && totalDeal !== 21) {
      this.toast.success('Blackjack! Você venceu!');
      return;
    }

    if (totalDeal === 21 && totalJog !== 21) {
      this.toast.error('Dealer venceu! Blackjack da banca.');
      return;
    }

    // 3. Comparação normal
    if (totalJog > totalDeal) {
      this.toast.success('Você venceu!');
      return;
    }

    if (totalDeal > totalJog) {
      this.toast.error('Dealer venceu!');
      return;
    }

    // 4. Empate (banca vence)
    this.toast.error('Empate — Dealer vence pela regra da banca');
  }

  private decidirResultado(): 'VITÓRIA' | 'DERROTA' | 'EMPATE' {
    const totalJog = this.getPontuacao(this.maoJogador);
    const totalDeal = this.getPontuacao(this.maoDealer);

    // se jogador estourou => derrota
    if (totalJog > 21) return 'DERROTA';

    // se dealer estourou => vitória
    if (totalDeal > 21) return 'VITÓRIA';

    // nenhum estourou -> comparar valores
    if (totalJog > totalDeal) return 'VITÓRIA';
    if (totalDeal > totalJog) return 'DERROTA';

    // empate -> por regra da banca é derrota do jogador
    return 'DERROTA';
  }

  registrarPartidaNoHistorico(): void {
    const resultado = this.decidirResultado(); // VITORIA | DERROTA | EMPATE (se optar)

    const partida = {
      jogador: [...this.maoJogador],
      dealer: [...this.maoDealer],
      resultado,
      data: new Date().toLocaleString('pt-BR'),
    };

    // evitar duplicatas simples: comparar com o último registro salvo
    const ult = this.storage.listarPartidas()[0];
    if (ult) {
      const isSame =
        JSON.stringify(ult.jogador) === JSON.stringify(partida.jogador) &&
        JSON.stringify(ult.dealer) === JSON.stringify(partida.dealer) &&
        ult.resultado === partida.resultado;
      if (isSame) {
        // já está salvo — não registra de novo
        return;
      }
    }

    this.storage.registrarPartida(partida);
  }

  registrarPartida(): void {
    this.storage.registrarPartida({
      jogador: [...this.maoJogador],
      dealer: [...this.maoDealer],
      resultado: this.mensagemFinal.includes('venceu')
        ? 'VITÓRIA'
        : this.mensagemFinal.includes('perdeu') || this.mensagemFinal.includes('Dealer venceu')
        ? 'DERROTA'
        : 'EMPATE',
      data: new Date().toLocaleString('pt-BR'),
    });
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
