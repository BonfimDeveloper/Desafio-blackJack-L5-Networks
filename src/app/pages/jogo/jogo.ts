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
import { Vitoria } from '../../shared/components/vitoria/vitoria';
import { Derrota } from '../../shared/components/derrota/derrota';

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
    Vitoria,
    Derrota,
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
  jogoEncerrado: boolean = false;

  resultadoFinal: 'VITÓRIA' | 'DERROTA' | 'EMPATE' | null = null;

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

  resetJogo() {
    // 1. Resetar o componente Baralho
    if (this.baralho && this.baralho.reset) {
      // Verifica se a referência e o método existem
      this.baralho.reset(); // 💡 CHAMA O MÉTODO DE RESET DO BARALHO
    }
    // limpa estados
    this.jogoEncerrado = false;
    this.mostraCartaDealerFimJogo = false;
    this.mensagemFinal = '';

    // limpa mãos
    this.maoJogador = [];
    this.maoDealer = [];

    // reseta vez do jogador
    this.vezDoJogador = true;

    this.resultadoFinal = null; // LIMPAR o resultado ao resetar

    // inicia nova rodada
    setTimeout(() => {
      this.distribuirCartasIniciais();
    }, 200);
  }

  private distribuirCartasIniciais() {
    this.jogoEncerrado = false;
    this.mostraCartaDealerFimJogo = false;
    this.mensagemFinal = '';
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
    return this.maoJogador.length < this.maxCartasJogador;
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

      // se atingiu 21 → parar e chamar dealer automaticamente
      if (totalJog === 21) {
        this.vezDoJogador = false;

        this.fimDeJogo('jogador');
        return;
      }

      // se o jogador parar de pedir automaticamente por limite
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
    if (this.jogoEncerrado) return;

    const totalJogador = this.getPontuacao(this.maoJogador);

    const loop = () => {
      if (this.jogoEncerrado) return; // se acabou antes
      const totalDealer = this.getPontuacao(this.maoDealer);

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
    if (this.jogoEncerrado) return; // já finalizado

    this.jogoEncerrado = true;
    this.revelarCartasDealer();

    // Força a exibição da carta do dealer e encerra o turno do jogador
    this.mostraCartaDealerFimJogo = true;
    this.vezDoJogador = false;

    const totalJog = this.getPontuacao(this.maoJogador);

    // Usa a função decidirResultado para obter VITÓRIA ou DERROTA (o EMPATE é tratado como DERROTA na sua implementação)
    const resultado = this.decidirResultado();
    this.resultadoFinal = resultado;

    if (resultado === 'VITÓRIA') {
      this.toast.success(`🎉 Vitória! Você alcançou ${totalJog} pontos.`);
    } else {
      // Cobre DERROTA e EMPATE (tratado como DERROTA)
      let mensagem = `😭 Derrota. Você terminou com ${totalJog} pontos.`;

      // Adiciona um contexto simples se o Jogador estourou
      if (totalJog > 21) {
        mensagem = `😭 Derrota. Você estourou com ${totalJog} pontos.`;
      } else if (
        resultado === 'DERROTA' &&
        this.getPontuacao(this.maoDealer) === 21 &&
        this.maoDealer.length === 2
      ) {
        // Caso Blackjack do Dealer
        mensagem = `😭 Derrota. Dealer fez Blackjack. Você terminou com ${totalJog} pontos.`;
      }

      this.toast.error(mensagem);
    }

    this.registrarPartidaNoHistorico();
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
    const resultado = this.decidirResultado();
    this.storage.registrarPartida({
      jogador: [...this.maoJogador],
      dealer: [...this.maoDealer],
      resultado,
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
    this.mostraCartaDealerFimJogo = true;
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
    return `${this.maoJogador.length}/${this.maxCartasJogador}`;
  }
}
