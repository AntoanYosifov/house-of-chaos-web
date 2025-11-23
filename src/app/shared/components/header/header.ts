import {Component, HostBinding, HostListener, Signal} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../core/services";
import {UserAppModel} from "../../../models/user";

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
                private authService: AuthService) {
        this.isLoggedIn = this.authService.isLoggedIn;
        this.currentUser = this.authService.currentUser;
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
