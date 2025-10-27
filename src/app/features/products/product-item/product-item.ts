import {Component} from '@angular/core';
import {ProductService} from "../../../core/services";

@Component({
    selector: 'app-product-item',
    imports: [],
    templateUrl: './product-item.html',
    standalone: true,
    styleUrl: './product-item.css'
})
export class ProductItem {
    name: string = 'Product Name';
    description: string = 'Product description';
    price: number = 0;
    quantity: number = 0;
    img_url: string = '';

    constructor(private productService: ProductService) {
    }

    getProductById() {
      this.productService.getById$().subscribe({
          next: v => console.log(v)
      })
    }
}
