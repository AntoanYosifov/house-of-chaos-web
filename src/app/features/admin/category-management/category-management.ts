import {Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import {CategoryModel, ApiCategoryCreateRequestModel} from '../../../models/category';
import {CategoryService} from '../../../core/services/category.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
    selector: 'app-category-management',
    imports: [ReactiveFormsModule],
    templateUrl: './category-management.html',
    standalone: true,
    styleUrl: './category-management.css'
})
export class CategoryManagement implements OnInit, OnDestroy {

    categories: CategoryModel[] = [];
    loading: boolean = true;
    showAddForm: boolean = false;
    categoryForm: FormGroup;
    submitting: boolean = false;
    submitError: string | null = null;
    @ViewChild('categoryNameInput') categoryNameInput?: ElementRef<HTMLInputElement>;
    showSuccessBanner: boolean = false;
    isHidingBanner: boolean = false;
    successBannerTitle: string = '';
    successBannerMessage: string = '';
    showErrorBanner: boolean = false;
    isErrorBannerHiding: boolean = false;
    errorBannerTitle: string = '';
    errorBannerMessage: string = '';

    private destroyRef = inject(DestroyRef)
    private successBannerHideTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private successBannerRemoveTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private errorBannerHideTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private errorBannerRemoveTimeoutId: ReturnType<typeof setTimeout> | null = null;

    constructor(private categoryService: CategoryService,
                private formBuilder: FormBuilder) {
        this.categoryForm = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.destroyRef.onDestroy(() => {
            this.clearSuccessBannerTimeouts();
            this.clearErrorBannerTimeouts();
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    ngOnDestroy(): void {
        this.clearSuccessBannerTimeouts();
        this.clearErrorBannerTimeouts();
    }

    loadCategories(): void {
        this.loading = true;
        this.categoryService.getAll$().pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: res => {
                    this.categories = res;
                    this.loading = false;
                },
                error: err => {
                    console.error(err);
                    this.loading = false;
                }
            });
    }

    get name(): AbstractControl | null {
        return this.categoryForm.get('name');
    }

    get isNameNotValid(): boolean {
        return (this.name?.invalid && (this.name?.dirty || this.name?.touched)) || false;
    }

    onAddCategoryClick(): void {
        this.showAddForm = !this.showAddForm;
        this.submitError = null;
        this.categoryForm.reset();
        if (this.showAddForm) {
            queueMicrotask(() => this.focusNameInput());
        }
    }

    onCancelAdd(): void {
        this.showAddForm = false;
        this.categoryForm.reset();
        this.submitError = null;
    }

    onSubmit(): void {
        if (!this.showAddForm) {
            return;
        }
        if (this.categoryForm.invalid) {
            this.categoryForm.markAllAsTouched();
            return;
        }
        const {name} = this.categoryForm.getRawValue();
        const trimmedName = (name ?? '').toString().trim();
        if (!trimmedName) {
            this.categoryForm.patchValue({name: ''});
            this.categoryForm.markAllAsTouched();
            return;
        }
        const payload: ApiCategoryCreateRequestModel = {name: trimmedName};
        this.submitting = true;
        this.submitError = null;
        this.categoryForm.disable();
        this.categoryService.addCategory$(payload).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: created => {
                    this.categories = [created, ...this.categories];
                    this.showAddForm = false;
                    this.categoryForm.enable();
                    this.categoryForm.reset();
                    this.submitting = false;
                    this.clearErrorBannerTimeouts();
                    this.showErrorBanner = false;
                    this.displaySuccessBanner(
                        'Category Added',
                        `${created.name} is now available for assignments.`
                    );
                },
                error: err => {
                    console.error(err);
                    if (err.status === 409 && err.error?.title === 'Category already exist') {
                        this.submitError = 'This category name already exists. Please choose a different name.';
                    } else {
                        this.submitError = err?.error?.message || 'Unable to add category. Please try again.';
                    }
                    this.categoryForm.enable();
                    this.submitting = false;
                },
                complete: () => {
                    if (!this.categoryForm.enabled) {
                        this.categoryForm.enable();
                    }
                    this.submitting = false;
                }
            });
    }

    onDeleteCategory(category: CategoryModel): void {
        if (!category?.id) {
            return;
        }
        const confirmed = window.confirm(`Delete ${category.name}? This action cannot be undone.`);
        if (!confirmed) {
            return;
        }
        this.categoryService.deleteCategory$(category.id).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.categories = this.categories.filter(c => c.id !== category.id);
                    this.clearErrorBannerTimeouts();
                    this.showErrorBanner = false;
                    this.displaySuccessBanner(
                        'Category Deleted',
                        `${category.name} was removed successfully.`
                    );
                },
                error: err => {
                    console.error(err);
                    if (err.status === 409 && err.error?.title === 'Business rule violation') {
                        this.displayErrorBanner(
                            'Cannot Delete Category',
                            'This category has products assigned.'
                        );
                    } else if (err.status === 404) {
                        this.displayErrorBanner(
                            'Category Not Found',
                            'The category could not be found. It might have been removed already.'
                        );
                    } else {
                        this.displayErrorBanner(
                            'Deletion Failed',
                            'Unable to delete the category right now. Please try again.'
                        );
                    }
                }
            });
    }

    private focusNameInput(): void {
        if (this.categoryNameInput?.nativeElement) {
            this.categoryNameInput.nativeElement.focus();
        }
    }

    private displaySuccessBanner(title: string, message: string): void {
        this.clearSuccessBannerTimeouts();
        this.successBannerTitle = title;
        this.successBannerMessage = message;
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.showSuccessBanner = true;
        this.isHidingBanner = false;

        this.successBannerHideTimeoutId = setTimeout(() => {
            this.isHidingBanner = true;
            this.successBannerRemoveTimeoutId = setTimeout(() => {
                this.showSuccessBanner = false;
            }, 400);
        }, 4000);
    }

    private displayErrorBanner(title: string, message: string): void {
        this.clearErrorBannerTimeouts();
        this.errorBannerTitle = title;
        this.errorBannerMessage = message;
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.showErrorBanner = true;
        this.isErrorBannerHiding = false;

        this.errorBannerHideTimeoutId = setTimeout(() => {
            this.isErrorBannerHiding = true;
            this.errorBannerRemoveTimeoutId = setTimeout(() => {
                this.showErrorBanner = false;
            }, 400);
        }, 4000);
    }

    private clearSuccessBannerTimeouts(): void {
        if (this.successBannerHideTimeoutId) {
            clearTimeout(this.successBannerHideTimeoutId);
            this.successBannerHideTimeoutId = null;
        }
        if (this.successBannerRemoveTimeoutId) {
            clearTimeout(this.successBannerRemoveTimeoutId);
            this.successBannerRemoveTimeoutId = null;
        }
    }

    private clearErrorBannerTimeouts(): void {
        if (this.errorBannerHideTimeoutId) {
            clearTimeout(this.errorBannerHideTimeoutId);
            this.errorBannerHideTimeoutId = null;
        }
        if (this.errorBannerRemoveTimeoutId) {
            clearTimeout(this.errorBannerRemoveTimeoutId);
            this.errorBannerRemoveTimeoutId = null;
        }
    }
}

