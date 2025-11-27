import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {OrderService} from "../../../core/services";
import {OrderAppModel} from "../../../models/order/order-app.model";

interface StatusCard {
  id: 'new' | 'confirmed' | 'cancelled';
  title: string;
  description: string;
}

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-dashboard.html',
  styleUrl: './orders-dashboard.css'
})
export class OrdersDashboard implements OnInit {

  private orderService = inject(OrderService);
  private router = inject(Router);

  readonly statusCards: StatusCard[] = [
    { id: 'new', title: 'New Orders', description: 'Awaiting confirmation' },
    { id: 'confirmed', title: 'Confirmed Orders', description: 'On their way' },
    { id: 'cancelled', title: 'Cancelled Orders', description: 'Recently cancelled' }
  ];

  newOrders: OrderAppModel[] = [];
  isLoadingNew = true;
  newOrdersError = '';
  deletingOrderIds = new Set<string>();

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.loadNewOrders();
  }

  loadNewOrders(): void {
    this.isLoadingNew = true;
    this.newOrdersError = '';

    this.orderService.getNewOrders$().subscribe({
      next: (orders) => {
        this.newOrders = orders;
        this.isLoadingNew = false;
      },
      error: () => {
        this.newOrdersError = 'We could not load your new orders. Please try again.';
        this.isLoadingNew = false;
      }
    });
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  deleteOrder(orderId: string): void {
    if (this.deletingOrderIds.has(orderId)) {
      return;
    }

    const confirmed = typeof window !== 'undefined'
      ? window.confirm('Are you sure you want to delete this order?')
      : true;

    if (!confirmed) {
      return;
    }

    this.deletingOrderIds.add(orderId);
    this.orderService.deleteOrder$(orderId).subscribe({
      next: () => {
        this.newOrders = this.newOrders.filter(order => order.id !== orderId);
        this.deletingOrderIds.delete(orderId);
      },
      error: () => {
        this.deletingOrderIds.delete(orderId);
        alert('Unable to delete this order right now. Please try again.');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
