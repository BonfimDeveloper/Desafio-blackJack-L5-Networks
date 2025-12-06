import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  constructor(private auth: AuthService, private router: Router, private loader: LoaderService) {}
}
