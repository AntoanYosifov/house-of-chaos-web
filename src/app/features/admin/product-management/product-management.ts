import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryModel} from "../../../models/category";
import {ProductAppModel} from "../../../models/product";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CategoryService} from "../../../core/services/category.service";
import {AuthService, ProductService} from "../../../core/services";
import {ProductBoard} from "../../products/product-board/product-board";

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
    showSuccessBanner: boolean = false;
    isHidingBanner: boolean = false;
    successBannerTitle: string = '';
    successBannerMessage: string = '';

    private destroyRef = inject(DestroyRef)
    private bannerHideTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private bannerRemoveTimeoutId: ReturnType<typeof setTimeout> | null = null;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private categoryService: CategoryService,
                private productService: ProductService,
                private authService: AuthService) {
        this.destroyRef.onDestroy(() => this.clearBannerTimeouts());
    }

    ngOnInit(): void {
        this.checkForSuccessMessage();
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoriesLoading = true;
        this.categoryService.getAll$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: cats => {
                this.categories = cats;
                this.categoriesLoading = false;
                this.checkForCategoryQueryParam();
            },
            error: err => {
                console.error(err);
                this.categoriesLoading = false;
            }
        })
    }

    checkForCategoryQueryParam(): void {
        const categoryId = this.route.snapshot.queryParams['categoryId'];
        if (categoryId && this.categories.length > 0) {
            const category = this.categories.find(cat => cat.id === categoryId);
            if (category) {
                this.selectedCategory = category;
                this.loadProductsForCategory(categoryId);
            }
        }
    }

    checkForSuccessMessage(): void {
        const updated = this.route.snapshot.queryParams['updated'];
        if (updated === 'true') {
            this.displaySuccessBanner(
                'Product Updated Successfully!',
                'The product has been updated with your changes.',
                true
            );
        }
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
        this.router.navigate(['/products', product.id]);
    }

    onEditProduct(product: ProductAppModel): void {
        const categoryId = this.selectedCategory?.id;
        if (categoryId) {
            this.router.navigate(['/admin/products/edit', product.id], {
                queryParams: { categoryId: categoryId }
            });
        } else {
            this.router.navigate(['/admin/products/edit', product.id]);
        }
    }

    onDeleteProduct(product: ProductAppModel): void {
        if (!product?.id) {
            return;
        }

        if (!this.isCurrentUserAdmin()) {
            return;
        }

        const confirmed = window.confirm(`Delete ${product.name || 'this product'}?`);
        if (!confirmed) {
            return;
        }

        this.productService.deleteProduct$(product.id).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.products = this.products.filter(p => p.id !== product.id);
                    this.displaySuccessBanner(
                        'Product Deleted',
                        `${product.name || 'The product'} was deleted successfully.`
                    );
                    if (this.products.length === 0 && this.selectedCategory?.id) {
                        this.loadProductsForCategory(this.selectedCategory.id);
                    }
                },
                error: err => {
                    console.error(err);
                }
            });
    }

    private displaySuccessBanner(title: string, message: string, clearUpdatedParam: boolean = false): void {
        this.clearBannerTimeouts();
        this.successBannerTitle = title;
        this.successBannerMessage = message;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showSuccessBanner = true;
        this.isHidingBanner = false;

        this.bannerHideTimeoutId = setTimeout(() => {
            this.isHidingBanner = true;
            this.bannerRemoveTimeoutId = setTimeout(() => {
                this.showSuccessBanner = false;
                if (clearUpdatedParam) {
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: { updated: null },
                        queryParamsHandling: 'merge'
                    });
                }
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

    private isCurrentUserAdmin(): boolean {
        const user = this.authService.currentUser();
        return user?.roles.includes('ADMIN') ?? false;
    }
}
