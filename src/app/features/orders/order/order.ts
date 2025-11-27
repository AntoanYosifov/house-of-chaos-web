import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OrderService} from "../../../core/services";
import {AuthService} from "../../../core/services";
import {OrderAppModel} from "../../../models/order/order-app.model";
import {AddressModel} from "../../../models/address";
import {finalize} from "rxjs";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class Order implements OnInit {

  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  order: OrderAppModel | null = null;
  isLoading = true;
  errorMessage = '';
  isProcessingConfirm = false;
  isProcessingCancel = false;
  showAddressForm = false;
  addressForm!: FormGroup;
  userDefaultAddress: AddressModel | null = null;
  private orderId: string | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.orderId = this.route.snapshot.paramMap.get('id');
    
    if (!this.orderId) {
      this.errorMessage = 'Order ID is missing.';
      this.isLoading = false;
      return;
    }

    this.initializeAddressForm();
    this.loadOrder(this.orderId);
  }

  initializeAddressForm(): void {
    const currentUser = this.authService.currentUser();
    const userAddress = currentUser?.address || null;
    this.userDefaultAddress = userAddress;

    this.addressForm = this.formBuilder.group({
      country: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.min(1)]],
      street: ['', Validators.required]
    });

    if (this.order?.shippingAddress) {
      this.addressForm.patchValue(this.order.shippingAddress);
    }
  }

  loadOrder(orderId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getOrderById$(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
        if (order.shippingAddress) {
          this.addressForm.patchValue(order.shippingAddress);
        }
      },
      error: () => {
        this.errorMessage = 'We could not load the order. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'status-badge status-new';
      case 'CONFIRMED':
        return 'status-badge status-confirmed';
      case 'CANCELLED':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  retryLoad(): void {
    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  isNewStatus(): boolean {
    return this.order?.status?.toUpperCase() === 'NEW';
  }

  isCancelledStatus(): boolean {
    return this.order?.status?.toUpperCase() === 'CANCELLED';
  }

  canAttemptConfirmation(): boolean {
    return this.isNewStatus() || this.isCancelledStatus();
  }

  handleConfirmOrder(): void {
    if (!this.order || !this.orderId || !this.canAttemptConfirmation()) {
      return;
    }

    if (!this.order.shippingAddress && !this.showAddressForm) {
      this.showAddressForm = true;
      return;
    }

    if (this.showAddressForm) {
      if (this.addressForm.invalid) {
        this.addressForm.markAllAsTouched();
        return;
      }

      if (this.isProcessingConfirm) {
        return;
      }

      this.isProcessingConfirm = true;
      this.errorMessage = '';

      const addressData: AddressModel = {
        country: this.addressForm.value.country,
        city: this.addressForm.value.city,
        zip: Number(this.addressForm.value.zip),
        street: this.addressForm.value.street
      };

      this.orderService.confirmOrder$(this.orderId, addressData).pipe(
        finalize(() => {
          this.isProcessingConfirm = false;
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/orders', this.orderId, 'confirmed']);
        },
        error: (error) => {
          console.error('Error confirming order:', error);
          this.errorMessage = 'Unable to confirm order. Please try again.';
        }
      });
    }
  }

  cancelAddressForm(): void {
    this.showAddressForm = false;
    this.addressForm.reset();
  }

  handleAddEditAddress(): void {
    this.showAddressForm = true;
    if (this.order?.shippingAddress) {
      this.addressForm.patchValue({
        country: this.order.shippingAddress.country,
        city: this.order.shippingAddress.city,
        zip: this.order.shippingAddress.zip,
        street: this.order.shippingAddress.street
      });
    }
  }

  hasDefaultAddress(): boolean {
    return !!this.userDefaultAddress;
  }

  useDefaultAddress(): void {
    if (!this.userDefaultAddress) {
      return;
    }
    this.showAddressForm = true;
    this.addressForm.patchValue({
      country: this.userDefaultAddress.country,
      city: this.userDefaultAddress.city,
      zip: this.userDefaultAddress.zip,
      street: this.userDefaultAddress.street
    });
  }

  handleCancelOrder(): void {
    if (!this.orderId || this.isProcessingCancel || !this.isNewStatus()) {
      return;
    }

    const confirmed = typeof window !== 'undefined'
      ? window.confirm('Are you sure you want to cancel this order?')
      : true;

    if (!confirmed) {
      return;
    }

    this.isProcessingCancel = true;
    this.errorMessage = '';

    this.orderService.cancelOrder$(this.orderId).pipe(
      finalize(() => {
        this.isProcessingCancel = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/orders', this.orderId, 'cancelled']);
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        this.errorMessage = 'Unable to cancel order. Please try again.';
      }
    });
  }
}

