import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductAppModel} from "../../../models/products";

@Component({
  selector: 'app-product-board',
  imports: [],
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

  onEditClick(event: MouseEvent, product: ProductAppModel): void {
    event.stopPropagation();
    this.editProduct.emit(product);
  }

  onDeleteClick(event: MouseEvent, product: ProductAppModel): void {
    event.stopPropagation();
    this.deleteProduct.emit(product);
  }
}
