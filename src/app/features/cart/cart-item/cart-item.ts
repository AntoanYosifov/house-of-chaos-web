import {Component, EventEmitter, Input, Output} from '@angular/core';

import {CartItemAppModel} from "../../../models/cart/cart-item-app.model";

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css'
})
export class CartItem {

  @Input() item!: CartItemAppModel;
  @Input() removeDisabled = false;
  @Input() deleteDisabled = false;
  @Output() removeOne = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();

  onRemoveOne() {
    if (this.removeDisabled) {
      return;
    }
    this.removeOne.emit();
  }

  onDeleteItem() {
    if (this.deleteDisabled) {
      return;
    }
    this.deleteItem.emit();
  }
}
