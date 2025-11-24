import {Component, OnInit, OnDestroy, Signal, DestroyRef, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService, ProductService} from "../../core/services";
import {CategoryService} from "../../core/services/category.service";
import {UserAppModel} from "../../models/user/user-app.model";
import {CategoryModel} from "../../models/category";
import {ProductAppModel} from "../../models/product";
import {ProductCard} from "../products/product-card/product-card";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private destroyRef = inject(DestroyRef);

  readonly isLoggedIn: Signal<boolean>;
  readonly currentUser: Signal<UserAppModel | null>;
  
  categories: CategoryModel[] = [];
  categoriesLoading: boolean = true;
  newArrivals: ProductAppModel[] = [];
  newArrivalsLoading: boolean = true;
  topDeals: ProductAppModel[] = [];
  topDealsLoading: boolean = true;

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
    this.setupScrollAnimations();
    this.loadCategories();
    this.loadNewArrivals();
    this.loadTopDeals();
  }

  loadCategories(): void {
    this.categoriesLoading = true;
    this.categoryService.getAll$().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: categories => {
        this.categories = categories;
        this.categoriesLoading = false;
        // Re-setup scroll animations after categories are loaded
        setTimeout(() => this.setupScrollAnimations(), 0);
      },
      error: err => {
        console.error('Error loading categories:', err);
        this.categoriesLoading = false;
      }
    });
  }

  onCategoryClick(category: CategoryModel): void {
    this.router.navigate(['/products/category', category.id]);
  }

  loadNewArrivals(): void {
    this.newArrivalsLoading = true;
    this.productService.getNewArrivals().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: products => {
        this.newArrivals = products;
        this.newArrivalsLoading = false;
        setTimeout(() => this.setupScrollAnimations(), 0);
      },
      error: err => {
        console.error('Error loading new arrivals:', err);
        this.newArrivalsLoading = false;
      }
    });
  }

  loadTopDeals(): void {
    this.topDealsLoading = true;
    this.productService.getTopDeals().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: products => {
        this.topDeals = products;
        this.topDealsLoading = false;
        setTimeout(() => this.setupScrollAnimations(), 0);
      },
      error: err => {
        console.error('Error loading top deals:', err);
        this.topDealsLoading = false;
      }
    });
  }

  onProductClick(product: ProductAppModel): void {
    this.router.navigate(['/products', product.id]);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupScrollAnimations() {
    // Disconnect existing observer if any
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach((el) => {
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          el.classList.add('animated');
        } else {
          this.observer?.observe(el);
        }
      });
    }, 100);
  }
}