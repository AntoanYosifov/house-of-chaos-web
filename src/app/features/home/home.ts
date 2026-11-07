import { Component, signal, OnInit, OnDestroy, Signal, DestroyRef, inject, ElementRef, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
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
  MockCategory,
  MockProduct
} from './home.mock';

const PRICE_FORMAT = new Intl.NumberFormat('bg-BG', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0
});

// Marquee: number of rendered copies (enough to cover very wide screens) and scroll speed
const MARQUEE_COPIES = 4;
const MARQUEE_SPEED_PX_PER_S = 32;

@Component({
  selector: 'app-home',
  imports: [RouterLink],
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
  private zone = inject(NgZone);
  private marqueeAnim: Animation | null = null;
  private marqueeRaf = 0;
  private marqueeHovered = false;
  private marqueeFocused = false;

  readonly marqueeCopies = Array.from({ length: MARQUEE_COPIES }, (_, i) => i);
  readonly roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  // Rooms index — which room's photo is on the plate (-1 = none)
  readonly activeRoom = signal(-1);

  readonly isLoggedIn: Signal<boolean>;
  readonly currentUser: Signal<UserAppModel | null>;

  isMobileMenuOpen = false;
  titleHidden = false;

  categories: MockCategory[] = [];
  newArrivals: MockProduct[] = [];
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
        setTimeout(() => {
          this.initScrollReveal();
          this.initMarquee();
        }, 0);
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

  // ── Category marquee ─────────────────────────────────────────
  // Driven by the Web Animations API (not a CSS keyframe) so playbackRate can be
  // tweened for a smooth slow-down on hover/focus instead of a hard freeze.
  private initMarquee(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host: HTMLElement = this.el.nativeElement;

    // Wait for webfonts — the set width (and so the duration) depends on Manrope's metrics
    document.fonts.ready.then(() => {
      const track = host.querySelector<HTMLElement>('.hero-marquee');
      if (!track || !track.isConnected) return;

      this.marqueeAnim?.cancel();
      const setWidth = track.offsetWidth / MARQUEE_COPIES;
      const duration = (setWidth / MARQUEE_SPEED_PX_PER_S) * 1000;

      this.zone.runOutsideAngular(() => {
        this.marqueeAnim = track.animate(
          [{ transform: 'translateX(0)' }, { transform: `translateX(-${100 / MARQUEE_COPIES}%)` }],
          { duration, iterations: Infinity, easing: 'linear' }
        );
      });
    });
  }

  onMarqueeHover(hovered: boolean): void {
    this.marqueeHovered = hovered;
    this.updateMarqueeRate();
  }

  onMarqueeFocusIn(event: FocusEvent): void {
    this.marqueeFocused = true;
    this.revealFocusedMarqueeItem(event.target as HTMLElement);
    this.updateMarqueeRate();
  }

  onMarqueeFocusOut(event: FocusEvent): void {
    const wrap = event.currentTarget as HTMLElement;
    // Moving focus between links inside the strip keeps it paused
    if (wrap.contains(event.relatedTarget as Node | null)) return;
    this.marqueeFocused = false;
    this.updateMarqueeRate();
  }

  private updateMarqueeRate(): void {
    const paused = this.marqueeHovered || this.marqueeFocused;
    this.tweenMarqueeRate(paused ? 0 : 1, paused ? 450 : 600);
  }

  // Ease playbackRate toward target: decelerate into a stop, accelerate gently out of it
  private tweenMarqueeRate(target: number, ms: number): void {
    const anim = this.marqueeAnim;
    if (!anim) return;
    cancelAnimationFrame(this.marqueeRaf);
    const from = anim.playbackRate;
    const start = performance.now();
    const ease = target === 0
      ? (p: number) => 1 - Math.pow(1 - p, 3)   // ease-out
      : (p: number) => p * p * p;               // ease-in

    this.zone.runOutsideAngular(() => {
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / ms);
        anim.playbackRate = from + (target - from) * ease(p);
        if (p < 1) this.marqueeRaf = requestAnimationFrame(step);
      };
      this.marqueeRaf = requestAnimationFrame(step);
    });
  }

  // Keyboard focus can land on a link that is currently off-screen (the strip
  // uses overflow: clip, so the browser can't scroll it). Shift the animation
  // timeline so the focused link sits just inside the visible area.
  private revealFocusedMarqueeItem(item: HTMLElement): void {
    const anim = this.marqueeAnim;
    const wrapEl = item?.closest<HTMLElement>('.hero-marquee-wrap');
    if (!anim || !wrapEl || !item.classList.contains('mq-item')) return;

    const wrap = wrapEl.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const margin = wrap.width * 0.1; // clears the edge fade and the desktop sidebar
    if (rect.left >= wrap.left + margin && rect.right <= wrap.right - margin) return;

    const shiftPx = rect.left - (wrap.left + margin);
    const duration = Number(anim.effect?.getTiming().duration ?? 0);
    if (!duration) return;
    const t = Number(anim.currentTime ?? 0) + (shiftPx / MARQUEE_SPEED_PX_PER_S) * 1000;
    anim.currentTime = ((t % duration) + duration) % duration;
  }

  // Observer for manifesto text + category cards — fires when element enters viewport
  private initScrollReveal(): void {
    this.cardObserver?.disconnect();
    const els = this.el.nativeElement.querySelectorAll(
      '.manifesto-line, .manifesto-sub, .editorial-split-img, .editorial-split-card, .room-item'
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
    els.forEach((el: Element) => {
      // Stagger within a group (siblings), not across the whole page
      const i = Array.prototype.indexOf.call(el.parentElement?.children ?? [], el);
      (el as HTMLElement).style.setProperty('--stagger', `${Math.max(0, i) * 0.07}s`);
      this.cardObserver!.observe(el);
    });
  }

  // Separate observer for arrival cards — fires 400px before entering viewport
  private initArrivalObserver(): void {
    this.arrivalObserver?.disconnect();
    const cards = this.el.nativeElement.querySelectorAll('.arrival-card');
    this.arrivalObserver = new IntersectionObserver(
      (entries) => {
        // Reveals every time a card re-enters the viewport, like the sections above
        entries.forEach(entry => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((card: Element, i: number) => {
      (card as HTMLElement).style.setProperty('--stagger', `${i * 0.1}s`);
      this.arrivalObserver!.observe(card);
    });
  }

  loadNewArrivals(): void {
    // TODO: Remove mock when backend ready
    const src$: Observable<{ content: MockProduct[] }> = USE_MOCK_DATA
      ? of(MOCK_NEW_ARRIVALS)
      : this.productService.getNewArrivals(0, 4);
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

  // ── Rooms of the House ───────────────────────────────────────
  // Leaving the list by keyboard clears the plate
  onRoomsFocusOut(event: FocusEvent): void {
    const list = event.currentTarget as HTMLElement;
    if (!list.contains(event.relatedTarget as Node | null)) this.activeRoom.set(-1);
  }

  scrollToRooms(event: Event): void {
    const rooms = this.el.nativeElement.querySelector('#rooms') as HTMLElement | null;
    if (!rooms) return;
    event.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rooms.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }

  formatPrice(price: number): string {
    return PRICE_FORMAT.format(price);
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
    cancelAnimationFrame(this.marqueeRaf);
    this.marqueeAnim?.cancel();
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
