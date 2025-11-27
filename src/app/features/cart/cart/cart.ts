import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CartService} from "../../../core/services";
import {OrderService} from "../../../core/services";
import {CartItem} from "../cart-item/cart-item";
import {CartItemAppModel} from "../../../models/cart";
import {Router, RouterLink} from "@angular/router";
import {finalize} from "rxjs";
import {ApiOrderRequestModel} from "../../../models/order/api-order-request.model";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItem, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit, OnDestroy {

  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  readonly cart = this.cartService.cart;
  
  isLoading = true;
  errorMessage = '';
  itemPendingRemovalId: string | null = null;
  itemPendingDeletionId: string | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | null = null;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;
  isProcessingCheckout = false;

  constructor() {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.getCart$().subscribe({
      next: () => {
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
    const cart = this.cart();
    return !!cart && cart.items && cart.items.length > 0;
  }

  totalQuantity(): number {
    const cart = this.cart();
    if (!cart?.items) {
      return 0;
    }
    return cart.items.reduce((total, item) => total + (item.quantity ?? 0), 0);
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
      next: () => {
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
      next: () => {
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

  handleCheckout() {
    const cart = this.cart();
    if (!cart || !cart.items || cart.items.length === 0) {
      return;
    }

    if (this.isProcessingCheckout) {
      return;
    }

    this.isProcessingCheckout = true;

    const orderRequest: ApiOrderRequestModel = {
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.create$(orderRequest).pipe(
      finalize(() => {
        this.isProcessingCheckout = false;
      })
    ).subscribe({
      next: (order) => {
        console.log('Order created successfully:', order);
        this.cartService.getCart$().subscribe();
        this.router.navigate(['/orders', order.id], {
          state: { order: order }
        });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.showToast('Unable to create order. Please try again.', 'error');
      }
    });
  }
}
