import { Component, OnInit, OnDestroy, Signal, DestroyRef, inject, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService, ProductService } from '../../core/services';
import { CategoryService } from '../../core/services';
import { UserAppModel } from '../../models/user';
import { ProductAppModel } from '../../models/product';
import {
  USE_MOCK_DATA,
  MOCK_CATEGORIES,
  MOCK_NEW_ARRIVALS,
  MOCK_TOP_DEALS,
  MockCategory
} from './home.mock';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private el = inject(ElementRef);
  private cardObserver: IntersectionObserver | null = null;
  private arrivalObserver: IntersectionObserver | null = null;

  readonly isLoggedIn: Signal<boolean>;
  readonly currentUser: Signal<UserAppModel | null>;

  isMobileMenuOpen = false;

  categories: MockCategory[] = [];
  newArrivals: ProductAppModel[] = [];
  topDeals: ProductAppModel[] = [];

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit() {
    this.loadCategories();
    this.loadNewArrivals();
    this.loadTopDeals();
  }

  loadCategories(): void {
    // TODO: Remove mock when backend ready — replace of(MOCK_CATEGORIES) with this.categoryService.getAll$()
    const src$ = USE_MOCK_DATA ? of(MOCK_CATEGORIES) : this.categoryService.getAll$() as any;
    src$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (cats: MockCategory[]) => {
        this.categories = cats;
        setTimeout(() => this.initScrollReveal(), 0);
      },
      error: (err: any) => console.error('Error loading categories:', err)
    });
  }

  // Observer for manifesto text + category cards — fires when element enters viewport
  private initScrollReveal(): void {
    this.cardObserver?.disconnect();
    const els = this.el.nativeElement.querySelectorAll(
      '.category-card, .manifesto-line, .manifesto-sub, .editorial-split-img, .editorial-split-card'
    );
    this.cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el: Element, i: number) => {
      (el as HTMLElement).style.setProperty('--stagger', `${i * 0.1}s`);
      this.cardObserver!.observe(el);
    });
  }

  // Separate observer for arrival cards — fires 400px before entering viewport
  private initArrivalObserver(): void {
    this.arrivalObserver?.disconnect();
    const cards = this.el.nativeElement.querySelectorAll('.arrival-card');
    this.arrivalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.08 }
    );
    cards.forEach((card: Element, i: number) => {
      (card as HTMLElement).style.setProperty('--stagger', `${i * 0.1}s`);
      this.arrivalObserver!.observe(card);
    });
  }

  loadNewArrivals(): void {
    // TODO: Remove mock when backend ready
    const src$ = USE_MOCK_DATA ? of(MOCK_NEW_ARRIVALS) : this.productService.getNewArrivals(0, 4);
    src$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => {
        this.newArrivals = response.content;
        setTimeout(() => this.initArrivalObserver(), 0);
      },
      error: (err: any) => console.error('Error loading new arrivals:', err)
    });
  }

  loadTopDeals(): void {
    // TODO: Remove mock when backend ready
    const src$ = USE_MOCK_DATA ? of(MOCK_TOP_DEALS) : this.productService.getTopDeals(0, 4);
    src$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => { this.topDeals = response.content; },
      error: (err: any) => console.error('Error loading top deals:', err)
    });
  }

  onCategoryClick(categoryId: string): void {
    this.router.navigate(['/products/category', categoryId]);
  }

  onProductClick(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  ngOnDestroy() {
    this.cardObserver?.disconnect();
    this.arrivalObserver?.disconnect();
  }
}
