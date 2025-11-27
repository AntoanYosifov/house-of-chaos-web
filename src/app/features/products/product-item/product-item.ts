import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductAppModel} from "../../../models/product";

@Component({
    selector: 'app-product-item',
    imports: [],
    templateUrl: './product-item.html',
    standalone: true,
    styleUrl: './product-item.css'
})
export class ProductItem {
   @Input({required: true}) product!: ProductAppModel;
   @Input() addToCartDisabled = false;
   @Input() showMaxQuantityBanner = false;
   @Input() showLoginMessage = false;
   @Output() addToCart = new EventEmitter<void>();

   onAddToCart() {
       if (this.addToCartDisabled) {
           return;
       }
       this.addToCart.emit();
   }
}
