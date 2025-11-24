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

    private destroyRef = inject(DestroyRef)
    private bannerHideTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private bannerRemoveTimeoutId: ReturnType<typeof setTimeout> | null = null;

    constructor(private categoryService: CategoryService,
                private formBuilder: FormBuilder) {
        this.categoryForm = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.destroyRef.onDestroy(() => this.clearBannerTimeouts());
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    ngOnDestroy(): void {
        this.clearBannerTimeouts();
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
        console.log('Delete category clicked', category);
    }

    private focusNameInput(): void {
        if (this.categoryNameInput?.nativeElement) {
            this.categoryNameInput.nativeElement.focus();
        }
    }

    private displaySuccessBanner(title: string, message: string): void {
        this.clearBannerTimeouts();
        this.successBannerTitle = title;
        this.successBannerMessage = message;
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.showSuccessBanner = true;
        this.isHidingBanner = false;

        this.bannerHideTimeoutId = setTimeout(() => {
            this.isHidingBanner = true;
            this.bannerRemoveTimeoutId = setTimeout(() => {
                this.showSuccessBanner = false;
            }, 400);
        }, 4000);
    }

    private clearBannerTimeouts(): void {
        if (this.bannerHideTimeoutId) {
            clearTimeout(this.bannerHideTimeoutId);
            this.bannerHideTimeoutId = null;
        }
        if (this.bannerRemoveTimeoutId) {
            clearTimeout(this.bannerRemoveTimeoutId);
            this.bannerRemoveTimeoutId = null;
        }
    }
}

