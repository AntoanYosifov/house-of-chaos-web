import {Component, HostBinding, HostListener, Signal} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService, ProductService} from "../../../core/services";
import {UserAppModel} from "../../../models/user";
import {ProductCreateModel} from "../../../models/products";

@Component({
    selector: 'app-header',
    imports: [
        RouterLink
    ],
    templateUrl: './header.html',
    standalone: true,
    styleUrl: './header.css'
})
export class Header {

    readonly isLoggedIn: Signal<boolean>;
    readonly currentUser: Signal<UserAppModel | null>;

    constructor(private router: Router,
                private httpClient: HttpClient,
                private authService: AuthService,
                // Temporarily product service to test create product Endpoint
                private productService: ProductService ) {
        this.isLoggedIn = this.authService.isLoggedIn;
        this.currentUser = this.authService.currentUser;
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
            next: () => {
                this.router.navigate(['/home'])
            },
            error: (err) => {
                console.log('Server logout failed', err);
            }
        });
    }

    testProtectedEndPoint() {
        this.httpClient.get('http://localhost:8080/api/users/protected').subscribe({
            next: res => console.log(res)
        })
    }

    testCreateProductEndPoint() {
        const productAddModel: ProductCreateModel = {
            name: 'Angular Created product',
            description: 'Angular product description',
            price: 30.00,
            quantity: 1,
            imgUrl: 'https://www.angular-client.com/index.htm'
        }

        this.productService.addProduct$(productAddModel).subscribe({
            next: v => console.log(v)
        })
    }
}
