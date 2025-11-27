import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {OrderService} from "../../../core/services";
import {OrderAppModel} from "../../../models/order/order-app.model";
import {Observable} from "rxjs";

type OrderStatusTab = 'new' | 'confirmed' | 'cancelled';

interface StatusCard {
  id: OrderStatusTab;
  title: string;
  description: string;
  eyebrow: string;
  sectionTitle: string;
  emptyMessage: string;
  dateLabel: string;
}

interface StatusData {
  orders: OrderAppModel[];
  isLoading: boolean;
  error: string;
  loaded: boolean;
}

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-dashboard.html',
  styleUrl: './orders-dashboard.css'
})
export class OrdersDashboard implements OnInit, OnDestroy {

  private orderService = inject(OrderService);
  private router = inject(Router);

  readonly statusCards: StatusCard[] = [
    {
      id: 'new',
      title: 'New Orders',
      description: 'Awaiting confirmation',
      eyebrow: 'New Orders',
      sectionTitle: 'Awaiting your confirmation',
      emptyMessage: 'You do not have new orders right now.',
      dateLabel: 'Placed on'
    },
    {
      id: 'confirmed',
      title: 'Confirmed Orders',
      description: 'On their way',
      eyebrow: 'Confirmed Orders',
      sectionTitle: 'Already confirmed and on their way',
      emptyMessage: 'You do not have confirmed orders yet.',
      dateLabel: 'Confirmed on'
    },
    {
      id: 'cancelled',
      title: 'Cancelled Orders',
      description: 'Recently cancelled',
      eyebrow: 'Cancelled Orders',
      sectionTitle: 'Orders you decided to cancel',
      emptyMessage: 'You do not have cancelled orders.',
      dateLabel: 'Last updated'
    }
  ];

  readonly statusData: Record<OrderStatusTab, StatusData> = {
    new: { orders: [], isLoading: false, error: '', loaded: false },
    confirmed: { orders: [], isLoading: false, error: '', loaded: false },
    cancelled: { orders: [], isLoading: false, error: '', loaded: false }
  };

  selectedStatus: OrderStatusTab | null = null;
  deletingOrderIds = new Set<string>();
  bannerMessage: string | null = null;
  bannerType: 'success' | 'error' | null = null;
  private bannerTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onStatusCardClick(status: OrderStatusTab): void {
    if (this.selectedStatus !== status) {
      this.selectedStatus = status;
      if (!this.statusData[status].loaded) {
        this.fetchOrders(status);
      }
    } else if (!this.statusData[status].loaded) {
      this.fetchOrders(status);
    }

    this.scrollToOrdersSection();
  }

  refreshSelected(): void {
    if (!this.selectedStatus) {
      return;
    }
    this.fetchOrders(this.selectedStatus, true);
  }

  private fetchOrders(status: OrderStatusTab, force = false): void {
    const data = this.statusData[status];
    if (data.isLoading && !force) {
      return;
    }

    data.isLoading = true;
    data.error = '';

    let source$: Observable<OrderAppModel[]>;
    switch (status) {
      case 'new':
        source$ = this.orderService.getNewOrders$();
        break;
      case 'confirmed':
        source$ = this.orderService.getConfirmedOrders$();
        break;
      case 'cancelled':
        source$ = this.orderService.getCancelledOrders$();
        break;
      default:
        source$ = this.orderService.getNewOrders$();
        break;
    }

    source$.subscribe({
      next: (orders: OrderAppModel[]) => {
        data.orders = orders;
        data.isLoading = false;
        data.loaded = true;
      },
      error: () => {
        data.error = 'We could not load these orders. Please try again.';
        data.isLoading = false;
        data.loaded = false;
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
        (Object.keys(this.statusData) as OrderStatusTab[]).forEach(status => {
          this.statusData[status].orders = this.statusData[status].orders.filter(order => order.id !== orderId);
        });
        this.deletingOrderIds.delete(orderId);
        if (this.selectedStatus) {
          this.fetchOrders(this.selectedStatus, true);
        }
        this.showBanner('Order deleted successfully.', 'success');
      },
      error: () => {
        this.deletingOrderIds.delete(orderId);
        this.showBanner('Unable to delete this order right now. Please try again.', 'error');
      }
    });
  }

  private scrollToOrdersSection(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const el = document.getElementById('orders-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getStatusCard(status: OrderStatusTab): StatusCard | undefined {
    return this.statusCards.find(card => card.id === status);
  }

  getStatusData(status: OrderStatusTab): StatusData {
    return this.statusData[status];
  }

  getOrdersCount(status: OrderStatusTab): number {
    return this.statusData[status].orders.length;
  }

  formatStatusDate(order: OrderAppModel, status: OrderStatusTab): string {
    const date = status === 'confirmed' || status === 'cancelled'
      ? order.updatedAt
      : order.createdOn;

    return this.formatDate(date);
  }

  get activeStatus(): OrderStatusTab | null {
    return this.selectedStatus;
  }

  get activeCard(): StatusCard | null {
    if (!this.selectedStatus) {
      return null;
    }
    return this.getStatusCard(this.selectedStatus) ?? null;
  }

  get activeData(): StatusData | null {
    if (!this.selectedStatus) {
      return null;
    }
    return this.getStatusData(this.selectedStatus);
  }

  private showBanner(message: string, type: 'success' | 'error'): void {
    this.bannerMessage = message;
    this.bannerType = type;
    if (this.bannerTimeout) {
      clearTimeout(this.bannerTimeout);
    }
    this.bannerTimeout = setTimeout(() => {
      this.bannerMessage = null;
      this.bannerType = null;
      this.bannerTimeout = null;
    }, 4000);
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

  ngOnDestroy(): void {
    if (this.bannerTimeout) {
      clearTimeout(this.bannerTimeout);
    }
  }
}
