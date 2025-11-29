import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {finalize} from 'rxjs';
import {ReviewService, AuthService} from "../../../../core/services";

@Component({
    selector: 'app-review-form',
    imports: [ReactiveFormsModule],
    standalone: true,
    templateUrl: './review-form.html',
    styleUrl: './review-form.css'
})
export class ReviewForm {
    @Input({required: true}) productId!: string;
    @Input({required: true}) authorId!: string;
    @Output() reviewSubmitted = new EventEmitter<void>();

    private reviewService = inject(ReviewService);
    private authService = inject(AuthService);

    reviewForm: FormGroup;
    isSubmitting = false;
    submitError: string | null = null;
    submitSuccess = false;

    constructor(private formBuilder: FormBuilder) {
        this.reviewForm = this.formBuilder.group({
            body: ['', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(1000)
            ]]
        });
    }

    get body(): AbstractControl<any, any> | null {
        return this.reviewForm.get('body');
    }

    get isBodyNotValid(): boolean {
        return (this.body?.invalid && (this.body?.dirty || this.body?.touched)) || false;
    }

    get bodyErrorMessage(): string {
        if (this.body?.errors?.['required']) {
            return 'Review text is required.';
        }
        if (this.body?.errors?.['minlength']) {
            return 'Review must be at least 10 characters long.';
        }
        if (this.body?.errors?.['maxlength']) {
            return 'Review cannot exceed 1000 characters.';
        }
        return '';
    }

    get authorName(): string {
        const currentUser = this.authService.currentUser();
        return currentUser?.firstName || '';
    }

    onSubmit(): void {
        if (this.reviewForm.invalid || this.isSubmitting) {
            return;
        }

        const body = this.reviewForm.get('body')?.value || '';
        const authorName = this.authorName;
        if (!body || !this.authorId || !authorName) {
            this.submitError = 'Unable to submit review. Please try again.';
            return;
        }

        this.isSubmitting = true;
        this.submitError = null;
        this.submitSuccess = false;

        this.reviewService.createReview$(this.productId, body, this.authorId, authorName).pipe(
            finalize(() => {
                this.isSubmitting = false;
            })
        ).subscribe({
            next: () => {
                this.setSuccess();
                this.reviewSubmitted.emit();
            },
            error: (error) => {
                const errorMessage = error?.error?.message || 'Failed to submit review. Please try again.';
                this.setError(errorMessage);
            }
        });
    }

    resetForm(): void {
        this.reviewForm.reset();
        this.submitError = null;
        this.submitSuccess = false;
    }

    setError(error: string): void {
        this.submitError = error;
    }

    setSuccess(): void {
        this.submitSuccess = true;
        this.reviewForm.reset();
        // Reset success message after 3 seconds
        setTimeout(() => {
            this.submitSuccess = false;
        }, 3000);
    }
}
