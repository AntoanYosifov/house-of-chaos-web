import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CartItemAppModel} from "../../../models/cart/cart-item-app.model";

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css'
})
export class CartItem {

  @Input() item!: CartItemAppModel;
  @Input() removeDisabled = false;
  @Output() removeOne = new EventEmitter<void>();

  onRemoveOne() {
    if (this.removeDisabled) {
      return;
    }
    this.removeOne.emit();
  }
}
