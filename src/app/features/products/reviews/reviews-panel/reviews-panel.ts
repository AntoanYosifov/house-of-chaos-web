import {Component, EventEmitter, inject, Input, Output, signal, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ReviewForm} from '../review-form/review-form';
import {ReviewList} from '../review-list/review-list';
import {AuthService} from "../../../../core/services";


@Component({
    selector: 'app-reviews-panel',
    imports: [ReviewForm, ReviewList, RouterLink],
    standalone: true,
    templateUrl: './reviews-panel.html',
    styleUrl: './reviews-panel.css'
})
export class ReviewsPanel {
    @Input({required: true}) productId!: string;
    @Input({required: true}) isOpen = signal(false);
    @Output() closePanel = new EventEmitter<void>();

    private authService = inject(AuthService);

    @ViewChild(ReviewList) reviewList!: ReviewList;

    get currentUser() {
        return this.authService.currentUser();
    }

    get authorId(): string {
        return this.currentUser?.id || '';
    }

    get canWriteReview(): boolean {
        return !!this.currentUser?.firstName;
    }

    onBackdropClick(): void {
        this.close();
    }

    onPanelClick(event: Event): void {
        event.stopPropagation();
    }

    close(): void {
        this.isOpen.set(false);
        this.closePanel.emit();
    }

    onReviewSubmitted(): void {
        // Refresh the review list when a new review is submitted
        if (this.reviewList) {
            setTimeout(() => {
                this.reviewList.refresh();
            }, 500); // Small delay to ensure backend has processed the review
        }
    }
}
