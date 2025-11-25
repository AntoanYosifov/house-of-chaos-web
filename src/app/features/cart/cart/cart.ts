import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CartService} from "../../../core/services/cart.service";
import {CartAppModel} from "../../../models/cart/cart-app.model";
import {CartItem} from "../cart-item/cart-item";
import {CartItemAppModel} from "../../../models/cart/cart-item-app.model";
import {RouterLink} from "@angular/router";
import {finalize} from "rxjs";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItem, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  cart: CartAppModel | null = null;
  isLoading = true;
  errorMessage = '';
  itemPendingRemovalId: string | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.getCart$().subscribe({
      next: (cartResponse) => {
        this.cart = cartResponse;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load your cart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  hasItems(): boolean {
    return !!this.cart && this.cart.items && this.cart.items.length > 0;
  }

  totalQuantity(): number {
    if (!this.cart?.items) {
      return 0;
    }
    return this.cart.items.reduce((total, item) => total + (item.quantity ?? 0), 0);
  }

  trackByItem(_index: number, item: CartItemAppModel): string {
    return item.id;
  }

  handleRemoveOne(item: CartItemAppModel) {
    if (this.itemPendingRemovalId) {
      return;
    }

    this.itemPendingRemovalId = item.id;

    this.cartService.removeOneFromCart$(item.id).pipe(
      finalize(() => {
        this.itemPendingRemovalId = null;
      })
    ).subscribe({
      next: (cartResponse) => {
        this.cart = cartResponse;
      },
      error: () => {
        console.error('Unable to update cart item quantity.');
      }
    });
  }
}
