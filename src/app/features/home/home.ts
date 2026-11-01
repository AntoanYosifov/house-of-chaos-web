import { Component, OnInit, OnDestroy, Signal, DestroyRef, inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  private cardObserver: IntersectionObserver | null = null;
  private arrivalObserver: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private lastScrollY = 0;

  readonly isLoggedIn: Signal<boolean>;
  readonly currentUser: Signal<UserAppModel | null>;

  isMobileMenuOpen = false;
  titleHidden = false;

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
    this.initTitleScrollBehavior();
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

  // Title lives only over the hero photo:
  // - below the hero → always hidden (no backdrop, it would collide with content)
  // - over the hero  → hide when scrolling down past half the viewport, reveal when scrolling up
  private initTitleScrollBehavior(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const host: HTMLElement = this.el.nativeElement;
    this.lastScrollY = window.scrollY;

    this.scrollHandler = () => {
      const hero = host.querySelector<HTMLElement>('.hero');
      const titleWrap = host.querySelector<HTMLElement>('.sticky-title-wrap');
      if (!hero || !titleWrap) return;

      const current = window.scrollY;
      const scrollingDown = current > this.lastScrollY;

      // Bottom edge of the pinned title (sticky `top` + its own height; transforms don't affect offsetHeight)
      const titleBottom = parseFloat(getComputedStyle(titleWrap).top) + titleWrap.offsetHeight;
      const heroBehindTitle = hero.getBoundingClientRect().bottom > titleBottom;

      if (!heroBehindTitle) {
        this.titleHidden = true;
      } else if (scrollingDown && current > window.innerHeight * 0.5) {
        this.titleHidden = true;
      } else if (!scrollingDown) {
        this.titleHidden = false;
      }

      this.lastScrollY = current;
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    // Initial state — e.g. page restored mid-scroll after a refresh
    setTimeout(() => this.scrollHandler?.(), 0);
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
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
