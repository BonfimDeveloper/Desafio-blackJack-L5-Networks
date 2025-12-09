import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snack: MatSnackBar) {}

  success(msg: string, options: any = {}) {
    this.snack.open(msg, 'OK', {
      duration: 10000,
      panelClass: ['toast-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
      ...options,
    });
  }

  error(msg: string, options: any = {}) {
    this.snack.open(msg, 'Fechar', {
      duration: 10000,
      panelClass: ['toast-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
      ...options,
    });
  }
}
