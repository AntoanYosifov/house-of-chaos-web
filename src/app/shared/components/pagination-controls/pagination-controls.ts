import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-pagination-controls',
    imports: [],
    templateUrl: './pagination-controls.html',
    standalone: true,
    styleUrl: './pagination-controls.css'
})
export class PaginationControls {
    @Input() hasPreviousPage = false;
    @Input() hasNextPage = false;
    @Input() pageNumber = 1;
    @Input() totalPages = 1;

    @Output() previousPage = new EventEmitter<void>();
    @Output() nextPage = new EventEmitter<void>();

    onPreviousPage(): void {
        if (!this.hasPreviousPage) {
            return;
        }
        this.previousPage.emit();
    }

    onNextPage(): void {
        if (!this.hasNextPage) {
            return;
        }
        this.nextPage.emit();
    }
}
