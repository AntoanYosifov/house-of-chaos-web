import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from "./shared/components/header/header";
import {Footer} from "./shared/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('House Of Chaos');


}
