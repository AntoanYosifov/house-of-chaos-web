import {Component, OnInit, OnDestroy, Signal, DestroyRef, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../core/services";
import {CategoryService} from "../../core/services/category.service";
import {UserAppModel} from "../../models/user/user-app.model";
import {CategoryModel} from "../../models/category";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [],
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

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit() {
    this.setupScrollAnimations();
    this.loadCategories();
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