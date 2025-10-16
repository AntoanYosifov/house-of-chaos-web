import {Component, HostBinding, HostListener} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";

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

    constructor(private router: Router, private httpClient: HttpClient) {
    }

    @HostBinding('class.scrolled') isScrolled = false;

    @HostListener('window:scroll')
    onWindowScroll() {
        this.isScrolled = window.scrollY > 50;
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    testProtectedEndPoint() {
        this.httpClient.get('http://localhost:8080/api/users/protected').subscribe({
            next: res => console.log(res)
        })
    }
}
