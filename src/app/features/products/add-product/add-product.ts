import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {ProductService} from "../../../core/services";
import {ProductCreateModel} from "../../../models/products";
import {Router} from "@angular/router";

@Component({
    selector: 'app-add-product',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './add-product.html',
    standalone: true,
    styleUrl: './add-product.css'
})
export class AddProduct {
    addProductForm: FormGroup;

    selectedFile: File | null = null;
    previewUrl: string | null = null;
    imgUrl: string | null = null;
    uploaded: boolean = false;
    fileError: string | null = null;

    constructor(private productService: ProductService, private formBuilder: FormBuilder, private router: Router) {
        this.addProductForm = formBuilder.group(
            {
                name: ['', Validators.required],
                description: ['', [Validators.required, Validators.minLength(10)]],
                price: ['', [Validators.required, Validators.min(0.01)]],
                quantity: ['', [Validators.required, Validators.min(1)]]
            }
        )
    }

    get name(): AbstractControl | null {
        return this.addProductForm.get('name');
    }

    get description(): AbstractControl | null {
        return this.addProductForm.get('description');
    }

    get price(): AbstractControl | null {
        return this.addProductForm.get('price');
    }

    get quantity(): AbstractControl | null {
        return this.addProductForm.get('quantity');
    }

    get isNameNotValid(): boolean {
        return (this.name?.invalid && (this.name?.dirty || this.name?.touched)) || false;
    }

    get isDescriptionNotValid(): boolean {
        return (this.description?.invalid && (this.description?.dirty || this.description?.touched)) || false;
    }

    get isPriceNotValid(): boolean {
        return (this.price?.invalid && (this.price?.dirty || this.price?.touched)) || false;
    }

    get isQuantityNotValid(): boolean {
        return (this.quantity?.invalid && (this.quantity?.dirty || this.quantity?.touched)) || false;
    }

    get nameErrorMessage(): string {
        if (this.name?.errors?.['required']) {
            return 'Name for this product is required';
        }
        return '';
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

    get quantityErrorMessage(): string {
        if (this.quantity?.errors?.['required']) {
            return 'Quantity for the product is required';
        }

        if (this.quantity?.errors?.['min']) {
            return 'The quantity must be at least 1';
        }
        return '';
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        if (!file) {
            this.selectedFile = null;
            if (this.previewUrl) {
                URL.revokeObjectURL(this.previewUrl);
            }
            this.previewUrl = null;
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.fileError = 'Please select an image file.';
            return;
        }

        this.selectedFile = file;
        this.fileError = null;
        this.uploaded = false;

        this.productService.uploadProductImage$(file).subscribe({
            next: (imgUrl) => {
                this.uploaded = true;
                if (this.previewUrl) {
                    URL.revokeObjectURL(this.previewUrl);
                }
                this.previewUrl = URL.createObjectURL(file);
                this.imgUrl = imgUrl
            },
            error: err => {
                console.error(err);
                this.fileError = 'Upload failed. Please try again.';
                this.uploaded = false;
            }
        })
    }

    clearFile(input: HTMLInputElement) {
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
        }
        this.uploaded = false;
        this.previewUrl = null;
        this.selectedFile = null;
        this.fileError = null;
        input.value = '';
    }

    onReset() {
        this.addProductForm.reset();
    }

    onSubmit() {
        if (this.addProductForm.invalid || this.imgUrl === null) {
            this.addProductForm.markAllAsTouched();
            return;
        }

        const {name, description, price, quantity} = this.addProductForm.value;

        const productData: ProductCreateModel = {
            name,
            description,
            price,
            quantity,
            imgUrl: this.imgUrl
        }

        this.productService.addProduct$(productData).subscribe({
            next: created => this.router.navigate(['/products', created.id])
        })
    }
}


