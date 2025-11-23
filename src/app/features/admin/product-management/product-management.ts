import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CategoryModel} from "../../../models/category";
import {ProductAppModel} from "../../../models/products";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CategoryService} from "../../../core/services/category.service";
import {ProductService} from "../../../core/services";
import {ProductBoard} from "../../../features/products/product-board/product-board";

@Component({
    selector: 'app-product-management',
    imports: [ProductBoard],
    templateUrl: './product-management.html',
    standalone: true,
    styleUrl: './product-management.css'
})
export class ProductManagement implements OnInit {

    categories: CategoryModel[] = [];
    selectedCategory: CategoryModel | null = null;
    products: ProductAppModel[] = [];
    categoriesLoading: boolean = true;
    productsLoading: boolean = false;

    private destroyRef = inject(DestroyRef)

    constructor(private router: Router,
                private categoryService: CategoryService,
                private productService: ProductService) {
    }

    ngOnInit(): void {
        this.loadCategories()
    }

    loadCategories(): void {
        this.categoriesLoading = true;
        this.categoryService.getCategories$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: cats => {
                this.categories = cats;
                this.categoriesLoading = false;
            },
            error: err => {
                console.error(err);
                this.categoriesLoading = false;
            }
        })
    }

    goToAddProduct(): void {
        this.router.navigate(['/admin/products/new'])
    }

    onCategoryClick(category: CategoryModel): void {
        this.selectedCategory = category;
        this.loadProductsForCategory(category.id);
    }

    loadProductsForCategory(categoryId: string) {
        this.productsLoading = true;
        this.products = []; 
        this.productService.getByCategory$(categoryId).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: prods => {
                    this.products = prods;
                    this.productsLoading = false;
                },
                error: err => {
                    console.error(err);
                    this.productsLoading = false;
                }
            })
    }

    onProductSelected(product: ProductAppModel): void {
        // Navigate to product details or handle selection
        this.router.navigate(['/products', product.id]);
    }

    onEditProduct(product: ProductAppModel): void {
        // Navigate to edit product page
        this.router.navigate(['/admin/products/edit', product.id]);
    }

    onDeleteProduct(product: ProductAppModel): void {
        // Handle product deletion
        // TODO: Implement delete logic with confirmation
        console.log('Delete product:', product.id);
    }
}
