import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

export type DecorationTheme = 'default' | 'red' | 'blue' | 'error';
export type DecorationCircleCount = 3 | 5;

@Component({
    selector: 'app-page-decoration',
    imports: [NgClass],
    templateUrl: './page-decoration.html',
    standalone: true,
    styleUrl: './page-decoration.css'
})
export class PageDecoration {
    @Input() theme: DecorationTheme = 'default';
    @Input() circles: DecorationCircleCount = 5;
}
