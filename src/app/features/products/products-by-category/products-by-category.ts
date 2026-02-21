import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductBoard} from '../product-board/product-board';
import {ProductService} from '../../../core/services';
import {CategoryService} from '../../../core/services';
import {PageInfoModel, ProductAppModel} from '../../../models/product';
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
  pageInfo: PageInfoModel | null = null;
  loading: boolean = true;
  currentPage = 0;
  readonly pageSize = 8;

  private destroyRef = inject(DestroyRef);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    this.route.paramMap.pipe(
      map(paramMap => paramMap.get('categoryId')),
      filter((id): id is string => !!id),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(categoryId => {
      this.categoryId = categoryId;
      this.currentPage = 0;
      this.loadCategory(categoryId);
      this.loadProductsPage(categoryId, this.currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private loadCategory(categoryId: string): void {
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
  }

  private loadProductsPage(categoryId: string, page: number): void {
    this.loading = true;
    this.currentPage = page;

    this.productService.getByCategory$(categoryId, page, this.pageSize).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: response => {
        this.products = response.content;
        this.pageInfo = response.page;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading products:', err);
        this.pageInfo = null;
        this.loading = false;
      }
    });
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    const totalPages = this.pageInfo?.totalPages ?? 0;
    return totalPages > 0 && this.currentPage < totalPages - 1;
  }

  get displayPageNumber(): number {
    return this.currentPage + 1;
  }

  onPreviousPage(): void {
    if (!this.categoryId || !this.hasPreviousPage) {
      return;
    }
    this.loadProductsPage(this.categoryId, this.currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onNextPage(): void {
    if (!this.categoryId || !this.hasNextPage) {
      return;
    }
    this.loadProductsPage(this.categoryId, this.currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onProductSelected(product: ProductAppModel): void {
    this.router.navigate(['/products', product.id]);
  }
}
