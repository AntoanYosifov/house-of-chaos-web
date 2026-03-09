import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {PageDecoration} from "../../../shared/components/page-decoration/page-decoration";

@Component({
  selector: 'app-admin-panel',
  imports: [PageDecoration],
  templateUrl: './admin-panel.html',
  standalone: true,
  styleUrl: './admin-panel.css'
})
export class AdminPanel {
    constructor(private router: Router) {
    }

    goToCategories(): void {
      this.router.navigate(['/admin/categories'])
    }

    goToProducts(): void {
      this.router.navigate(['/admin/products'])
    }

    goToUsers(): void {
      this.router.navigate(['/admin/users'])
    }
}
