import {Component, Input} from '@angular/core';
import {ProductAppModel} from "../../../models/products";

@Component({
    selector: 'app-product-item',
    imports: [],
    templateUrl: './product-item.html',
    standalone: true,
    styleUrl: './product-item.css'
})
export class ProductItem {
   @Input({required: true}) product!: ProductAppModel
}
