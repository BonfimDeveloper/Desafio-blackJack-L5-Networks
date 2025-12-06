import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader';
import { HeaderComponent } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('blackjack');
}
