import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {ProductService} from "../../../core/services";
import {ProductCreateModel} from "../../../models/products";

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

    constructor(private productService: ProductService, private formBuilder: FormBuilder) {
        this.addProductForm = formBuilder.group(
            {
                name: ['', Validators.required],
                description: ['', [Validators.required, Validators.minLength(10)]],
                price: ['', [Validators.required, Validators.min(0)]],
                quantity: ['', [Validators.required, Validators.min(0)]],
                url: ['']
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

    get url(): AbstractControl | null {
        return this.addProductForm.get('url');
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
        if(this.name?.errors?.['required']) {
            return 'Name for this product is required';
        }
        return '';
    }

    get descriptionErrorMessage(): string {
        if(this.description?.errors?.['required']) {
            return 'Description for this product is required';
        }

        if(this.description?.errors?.['minlength']) {
            return 'Description is too short. Please elaborate more';
        }
        return '';
    }

    get priceErrorMessage(): string {
        if(this.price?.errors?.['required']) {
            return 'Price for the product is required';
        }

        if(this.price?.errors?.['min']) {
            return 'The price can not be a negative number';
        }
        return '';
    }

    get quantityErrorMessage(): string {
        if(this.quantity?.errors?.['required']) {
            return 'Quantity for the product is required';
        }

        if(this.quantity?.errors?.['min']) {
            return 'The quantity can not be a negative number';
        }
        return '';
    }

    onSubmit() {
        if (this.addProductForm.invalid) {
            this.addProductForm.markAllAsTouched();
            return;
        }

        const {name, description, price, quantity, url} = this.addProductForm.value;

        const productData: ProductCreateModel = {
            name,
            description,
            price,
            quantity,
            imgUrl: url
        }

        this.productService.addProduct$(productData).subscribe({
            next: v => console.log(v)
        })
    }

    onReset() {
        this.addProductForm.reset();
    }

}

// const productAddModel: ProductCreateModel = {
//   name: 'Angular Created product',
//   description: 'Angular product description',
//   price: 30.00,
//   quantity: 1,
//   imgUrl: 'https://www.angular-client.com/index.html'
// }

