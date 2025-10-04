import {Component, HostBinding, HostListener, OnInit} from '@angular/core';
import {RouterLink, Router} from "@angular/router";

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

    constructor(private router: Router) {
    }

    @HostBinding('class.scrolled') isScrolled = false;

    @HostListener('window:scroll')
    onWindowScroll() {
        this.isScrolled = window.scrollY > 50;
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
