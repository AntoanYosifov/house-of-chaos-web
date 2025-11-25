import {Component, computed, DestroyRef, HostBinding, HostListener, inject, OnInit, Signal} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService, CartService} from "../../../core/services";
import {UserAppModel} from "../../../models/user";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-header',
    imports: [
        RouterLink
    ],
    templateUrl: './header.html',
    standalone: true,
    styleUrl: './header.css'
})
export class Header implements OnInit {

    readonly isLoggedIn: Signal<boolean>;
    readonly currentUser: Signal<UserAppModel | null>;
    
    private destroyRef = inject(DestroyRef);
    private cartService = inject(CartService);
    
    readonly cart = this.cartService.cart;
    readonly cartItemsCount = computed(() => {
        const cart = this.cart();
        if (!cart || !cart.items) {
            return 0;
        }
        return cart.items.reduce((total, item) => total + (item.quantity ?? 0), 0);
    });

    constructor(private router: Router,
                private httpClient: HttpClient,
                private authService: AuthService) {
        this.isLoggedIn = this.authService.isLoggedIn;
        this.currentUser = this.authService.currentUser;
    }
    
    ngOnInit(): void {
        // Load cart if user is logged in and cart is not loaded
        if (this.isLoggedIn() && !this.cart()) {
            this.cartService.getCart$().pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe();
        }
    }

    isAdmin(): boolean {
        const user = this.currentUser();
        return user ? user.roles.includes('ADMIN') : false;
    }

    @HostBinding('class.scrolled') isScrolled = false;

    @HostListener('window:scroll')
    onWindowScroll() {
        this.isScrolled = window.scrollY > 50;
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    logout() {
        this.authService.logout$().subscribe({
            error: (err) => {
                this.authService.clientOnlyLogout();
                console.log('Server logout failed', err);
            }
        });
    }

}
