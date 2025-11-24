import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductBoard} from '../product-board/product-board';
import {ProductService} from '../../../core/services';
import {CategoryService} from '../../../core/services/category.service';
import {ProductAppModel} from '../../../models/product';
import {CategoryModel} from '../../../models/category';
import {distinctUntilChanged, filter, map} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-by-category',
  imports: [ProductBoard],
  templateUrl: './products-by-category.html',
  standalone: true,
  styleUrl: './products-by-category.css'
})
export class ProductsByCategory implements OnInit {

  categoryId: string | null = null;
  category: CategoryModel | null = null;
  products: ProductAppModel[] = [];
  loading: boolean = true;

  private destroyRef = inject(DestroyRef);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Scroll to top when component initializes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    this.route.paramMap.pipe(
      map(paramMap => paramMap.get('categoryId')),
      filter((id): id is string => !!id),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(categoryId => {
      this.categoryId = categoryId;
      this.loadCategoryAndProducts(categoryId);
      // Scroll to top when category changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private loadCategoryAndProducts(categoryId: string): void {
    this.loading = true;
    
    // Load category name
    this.categoryService.getAll$().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: categories => {
        this.category = categories.find(cat => cat.id === categoryId) || null;
      },
      error: err => {
        console.error('Error loading categories:', err);
      }
    });

    // Load products
    this.productService.getByCategory$(categoryId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: products => {
        this.products = products;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  onProductSelected(product: ProductAppModel): void {
    this.router.navigate(['/products', product.id]);
  }
}
