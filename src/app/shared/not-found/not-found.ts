import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageDecoration } from '../components/page-decoration/page-decoration';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, PageDecoration],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
