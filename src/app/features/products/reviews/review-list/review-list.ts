import {Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReviewService, AuthService} from '../../../../core/services';
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
    deletingReviewId: string | null = null;

    private reviewService = inject(ReviewService);
    private authService = inject(AuthService);
    private destroyRef = inject(DestroyRef);

    get currentUser() {
        return this.authService.currentUser();
    }

    isOwnReview(review: ReviewAppModel): boolean {
        return this.currentUser?.id === review.authorId;
    }

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

    deleteReview(reviewId: string): void {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }

        this.deletingReviewId = reviewId;

        this.reviewService.deleteReview$(reviewId).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
                this.deletingReviewId = null;
            })
        ).subscribe({
            next: () => {
                // Refresh the list after successful deletion
                this.loadReviews();
            },
            error: (error) => {
                const errorDetail = error?.error?.detail || error?.message;
                const errorMessage = errorDetail || 'Failed to delete review. Please try again.';
                alert(errorMessage);
            }
        });
    }
}
