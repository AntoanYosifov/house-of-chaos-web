import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  standalone: true,
  styleUrl: './admin-panel.css'
})
export class AdminPanel {
    constructor(private router: Router) {
    }

    goToProducts(): void {
      this.router.navigate(['/admin/products'])
    }
}
