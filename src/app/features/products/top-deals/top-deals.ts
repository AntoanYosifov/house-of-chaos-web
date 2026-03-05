import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductBoard} from '../product-board/product-board';
import {PaginationControls} from '../../../shared/components/pagination-controls/pagination-controls';
import {ProductService} from '../../../core/services';
import {PageInfoModel, ProductAppModel} from '../../../models/product';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-deals',
  imports: [ProductBoard, PaginationControls],
  templateUrl: './top-deals.html',
  standalone: true,
  styleUrl: './top-deals.css'
})
export class TopDeals implements OnInit {

  products: ProductAppModel[] = [];
  pageInfo: PageInfoModel | null = null;
  loading: boolean = true;
  currentPage = 0;
  readonly pageSize = 8;

  private destroyRef = inject(DestroyRef);

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadProducts(0);
  }

  private loadProducts(page: number): void {
    this.loading = true;
    this.currentPage = page;
    this.productService.getTopDeals(page, this.pageSize).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: response => {
        this.products = response.content;
        this.pageInfo = response.page;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading top deals:', err);
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
    if (!this.hasPreviousPage) {
      return;
    }
    this.loadProducts(this.currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onNextPage(): void {
    if (!this.hasNextPage) {
      return;
    }
    this.loadProducts(this.currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onProductSelected(product: ProductAppModel): void {
    this.router.navigate(['/products', product.id]);
  }
}
