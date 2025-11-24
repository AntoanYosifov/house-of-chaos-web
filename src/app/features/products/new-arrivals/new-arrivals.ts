import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductBoard} from '../product-board/product-board';
import {ProductService} from '../../../core/services';
import {ProductAppModel} from '../../../models/product';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-new-arrivals',
  imports: [ProductBoard],
  templateUrl: './new-arrivals.html',
  standalone: true,
  styleUrl: './new-arrivals.css'
})
export class NewArrivals implements OnInit {

  products: ProductAppModel[] = [];
  loading: boolean = true;

  private destroyRef = inject(DestroyRef);

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getNewArrivals().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: products => {
        this.products = products;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading new arrivals:', err);
        this.loading = false;
      }
    });
  }

  onProductSelected(product: ProductAppModel): void {
    this.router.navigate(['/products', product.id]);
  }
}
