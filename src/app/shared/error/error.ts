import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageDecoration } from '../components/page-decoration/page-decoration';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink, PageDecoration],
  templateUrl: './error.html',
  styleUrl: './error.css'
})
export class Error implements OnInit {
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  reloadPage(): void {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}
