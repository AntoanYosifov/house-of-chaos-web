import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {Header} from "./shared/components/header/header";
import {Footer} from "./shared/components/footer/footer";
import {DemoNotice} from "./shared/components/demo-notice/demo-notice";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, DemoNotice],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('House Of Chaos');
  // Starts hidden so the old header/footer don't flash on the home page before the first navigation ends
  readonly showShell = signal(false);
  protected readonly isDemo = environment.demo;

  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects;
      this.showShell.set(url !== '/home' && url !== '/');
    });
  }
}
