import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductAppModel} from "../../../models/product";
import {ProductCard} from "../product-card/product-card";

@Component({
    selector: 'app-product-board',
    imports: [ProductCard],
    templateUrl: './product-board.html',
    standalone: true,
    styleUrl: './product-board.css'
})
export class ProductBoard {
    @Input() products: ProductAppModel[] = []
    @Input() showAdminActions = false;

    @Output() productSelected = new EventEmitter<ProductAppModel>();
    @Output() editProduct = new EventEmitter<ProductAppModel>();
    @Output() deleteProduct = new EventEmitter<ProductAppModel>();

    onCardClick(product: ProductAppModel): void {
        this.productSelected.emit(product);
    }

    onEditClick(product: ProductAppModel): void {
        this.editProduct.emit(product);
    }

    onDeleteClick(product: ProductAppModel): void {
        this.deleteProduct.emit(product);
    }
}
