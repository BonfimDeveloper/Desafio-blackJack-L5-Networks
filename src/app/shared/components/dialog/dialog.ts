import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDividerModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {
  modalAberto = true;

  fecharModal() {
    this.modalAberto = false;
  }
}
