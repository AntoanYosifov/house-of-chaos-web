import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class Cart implements OnInit, OnDestroy {

  cart: CartAppModel | null = null;
  isLoading = true;
  errorMessage = '';
  itemPendingRemovalId: string | null = null;
  itemPendingDeletionId: string | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | null = null;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

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

  ngOnDestroy(): void {
    this.clearToastTimeout();
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
    if (this.itemPendingRemovalId || this.itemPendingDeletionId) {
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
        this.showToast(`${item.productName} updated in your cart.`, 'success');
      },
      error: () => {
        this.showToast('Unable to update this cart item. Please try again.', 'error');
      }
    });
  }

  handleDeleteItem(item: CartItemAppModel) {
    if (this.itemPendingRemovalId || this.itemPendingDeletionId) {
      return;
    }

    this.itemPendingDeletionId = item.id;

    this.cartService.deleteItem$(item.id).pipe(
      finalize(() => {
        this.itemPendingDeletionId = null;
      })
    ).subscribe({
      next: (cartResponse) => {
        this.cart = cartResponse;
        this.showToast(`${item.productName} removed from your cart.`, 'success');
      },
      error: () => {
        this.showToast('Unable to remove this item. Please try again.', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.clearToastTimeout();
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
      this.toastType = null;
      this.toastTimeout = null;
    }, 4000);
  }

  private clearToastTimeout() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }
}
