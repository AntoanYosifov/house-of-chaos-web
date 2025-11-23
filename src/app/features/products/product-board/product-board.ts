import {Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ProductAppModel} from "../../../models/products";

@Component({
    selector: 'app-product-board',
    imports: [],
    templateUrl: './product-board.html',
    standalone: true,
    styleUrl: './product-board.css'
})
export class ProductBoard implements OnInit, OnChanges {
    @Input() products: ProductAppModel[] = []

    @Input() showAdminActions = false;

    @Output() productSelected = new EventEmitter<ProductAppModel>();

    @Output() editProduct = new EventEmitter<ProductAppModel>();
    @Output() deleteProduct = new EventEmitter<ProductAppModel>();

    imageLoadedStates: Map<string, boolean> = new Map();
    cardVisibleStates: Map<string, boolean> = new Map();

    ngOnInit(): void {
        this.preloadImages();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['products'] && !changes['products'].firstChange) {
            this.preloadImages();
        }
    }

    preloadImages(): void {
        this.products.forEach((product, index) => {
            if (product?.id && product?.imgUrl) {
                // Reset loading state for new products
                this.imageLoadedStates.set(product.id, false);
                this.cardVisibleStates.set(product.id, false);

                // Preload image
                const img = new Image();
                const showCard = () => {
                    setTimeout(() => {
                        this.cardVisibleStates.set(product.id, true);
                    }, index * 30); // Stagger animation
                };
                
                img.onload = () => {
                    this.imageLoadedStates.set(product.id, true);
                    showCard();
                };
                img.onerror = () => {
                    this.imageLoadedStates.set(product.id, false);
                    showCard();
                };
                
                img.src = product.imgUrl;
                
                // If image is already cached, handle immediately
                if (img.complete && img.naturalWidth > 0) {
                    this.imageLoadedStates.set(product.id, true);
                    showCard();
                }
            } else {
                // No image, show immediately with slight delay for animation
                if (product?.id) {
                    setTimeout(() => {
                        this.cardVisibleStates.set(product.id, true);
                    }, index * 30);
                }
            }
        });
    }

    isImageLoaded(productId: string | undefined): boolean {
        if (!productId) return false;
        return this.imageLoadedStates.get(productId) ?? false;
    }

    isCardVisible(productId: string | undefined): boolean {
        if (!productId) return true;
        return this.cardVisibleStates.get(productId) ?? false;
    }

    onImageLoad(productId: string | undefined): void {
        if (productId) {
            this.imageLoadedStates.set(productId, true);
        }
    }

    onImageError(productId: string | undefined): void {
        if (productId) {
            this.imageLoadedStates.set(productId, false);
            this.cardVisibleStates.set(productId, true);
        }
    }

    onCardClick(product: ProductAppModel): void {
        // Only emit selection when not in admin mode
        if (!this.showAdminActions) {
            this.productSelected.emit(product);
        }
    }

    onEditClick(event: MouseEvent, product: ProductAppModel): void {
        event.stopPropagation();
        this.editProduct.emit(product);
    }

    onDeleteClick(event: MouseEvent, product: ProductAppModel): void {
        event.stopPropagation();
        this.deleteProduct.emit(product);
    }
}
