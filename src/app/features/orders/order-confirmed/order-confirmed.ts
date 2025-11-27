import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {OrderService} from "../../../core/services";
import {OrderAppModel} from "../../../models/order/order-app.model";

@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmed.html',
  styleUrl: './order-confirmed.css'
})
export class OrderConfirmed implements OnInit {

  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order: OrderAppModel | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    
    if (!orderId) {
      this.errorMessage = 'Order ID is missing.';
      this.isLoading = false;
      return;
    }

    this.loadOrder(orderId);
  }

  loadOrder(orderId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getOrderById$(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load the order. Please try again.';
        this.isLoading = false;
      }
    });
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
}
