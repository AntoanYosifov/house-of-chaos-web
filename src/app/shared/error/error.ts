import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink],
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
