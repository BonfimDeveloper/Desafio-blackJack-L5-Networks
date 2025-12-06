import { Component, computed } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../../core/services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loader-backdrop" *ngIf="visible()">
      <mat-progress-spinner mode="indeterminate" diameter="70"> </mat-progress-spinner>
    </div>
  `,
  styleUrls: ['./loader.css'],
})
export class LoaderComponent {
  constructor(private loader: LoaderService) {}

  visible = computed(() => this.loader.loading());
}
