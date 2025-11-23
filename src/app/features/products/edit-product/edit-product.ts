import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductService} from "../../../core/services";
import {ApiProductUpdateModel, ProductAppModel} from "../../../models/product";
import {ActivatedRoute, Router} from "@angular/router";
import {distinctUntilChanged, filter, map, switchMap, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-edit-product',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './edit-product.html',
    standalone: true,
    styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {
    editProductForm: FormGroup;
    product: ProductAppModel | null = null;
    loading: boolean = true;
    productId: string | null = null;

    private destroyRef = inject(DestroyRef)

    constructor(private productService: ProductService,
                private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute) {
        this.editProductForm = this.formBuilder.group(
            {
                description: ['', [Validators.required, Validators.minLength(10)]],
                price: ['', [Validators.required, Validators.min(0.01)]]
            }
        )
    }

    ngOnInit(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.loadProduct();
    }

    loadProduct(): void {
        this.loading = true;
        this.route.paramMap.pipe(
            map(paramMap => paramMap.get('id')),
            filter((id): id is string => !!id),
            distinctUntilChanged(),
            tap(id => this.productId = id),
            switchMap(id => this.productService.getById$(id)),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (product) => {
                this.product = product;
                this.loading = false;
                this.editProductForm.patchValue({
                    description: product.description,
                    price: product.price
                });
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    get description(): AbstractControl | null {
        return this.editProductForm.get('description');
    }

    get price(): AbstractControl | null {
        return this.editProductForm.get('price');
    }

    get isDescriptionNotValid(): boolean {
        return (this.description?.invalid && (this.description?.dirty || this.description?.touched)) || false;
    }

    get isPriceNotValid(): boolean {
        return (this.price?.invalid && (this.price?.dirty || this.price?.touched)) || false;
    }

    get descriptionErrorMessage(): string {
        if (this.description?.errors?.['required']) {
            return 'Description for this product is required';
        }

        if (this.description?.errors?.['minlength']) {
            return 'Description is too short. Please elaborate more';
        }
        return '';
    }

    get priceErrorMessage(): string {
        if (this.price?.errors?.['required']) {
            return 'Price for the product is required';
        }

        if (this.price?.errors?.['min']) {
            return 'The price must be at least 0.01';
        }
        return '';
    }

    onReset(): void {
        if (this.product) {
            this.editProductForm.patchValue({
                description: this.product.description,
                price: this.product.price
            });
        }
    }

    onSubmit(): void {
        if (this.editProductForm.invalid || !this.productId) {
            this.editProductForm.markAllAsTouched();
            return;
        }

        const {description, price} = this.editProductForm.value;

        const updateData: ApiProductUpdateModel = {
            description,
            price
        };

        this.productService.updateProduct$(this.productId, updateData).subscribe({
            next: () => {
                const categoryId = this.route.snapshot.queryParams['categoryId'];
                if (categoryId) {
                    this.router.navigate(['/admin/products'], {
                        queryParams: { categoryId: categoryId, updated: 'true' }
                    });
                } else {
                    this.router.navigate(['/admin/products'], {
                        queryParams: { updated: 'true' }
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}

