import {Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReviewService} from '../../../../core/services';
import {ReviewAppModel} from '../../../../models/review';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {finalize} from 'rxjs';

@Component({
    selector: 'app-review-list',
    imports: [CommonModule],
    templateUrl: './review-list.html',
    standalone: true,
    styleUrl: './review-list.css'
})
export class ReviewList implements OnInit, OnChanges {
    @Input({required: true}) productId!: string;

    reviews: ReviewAppModel[] = [];
    isLoading = false;
    errorMessage: string | null = null;

    private reviewService = inject(ReviewService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        if (this.productId) {
            this.loadReviews();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['productId'] && this.productId) {
            // Only load if productId has actually changed (not just initialized)
            if (!changes['productId'].firstChange) {
                this.loadReviews();
            }
        }
    }

    loadReviews(): void {
        if (!this.productId) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;

        this.reviewService.getReviewsByProductId$(this.productId).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe({
            next: (reviews) => {
                this.reviews = reviews;
            },
            error: (error) => {
                const errorDetail = error?.error?.detail || error?.message;
                this.errorMessage = errorDetail || 'Failed to load reviews. Please try again.';
                this.reviews = [];
            }
        });
    }

    refresh(): void {
        this.loadReviews();
    }
}
