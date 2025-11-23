import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  imports: [],
  templateUrl: './product-management.html',
  standalone: true,
  styleUrl: './product-management.css'
})
export class ProductManagement {
  constructor(private router: Router) {}
  goToAddProduct(): void {
    this.router.navigate(['/admin/products/new'])
  }
}
