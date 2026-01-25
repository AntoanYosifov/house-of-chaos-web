import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ProductAppModel} from '../../../models/product';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-product-card',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './product-card.html',
  standalone: true,
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard implements OnChanges {
  @Input({required: true}) product!: ProductAppModel;
  @Input() showAdminActions: boolean = false;
  @Input() size: 'default' | 'compact' = 'default';
  @Input() index: number = 0;

  @Output() productClicked = new EventEmitter<ProductAppModel>();
  @Output() editProduct = new EventEmitter<ProductAppModel>();
  @Output() deleteProduct = new EventEmitter<ProductAppModel>();

  imageLoaded: boolean = false;
  cardVisible: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && !changes['product'].firstChange) {
      this.imageLoaded = false;
      this.cdr.markForCheck();
    }
  }

  onImageLoad(): void {
    this.imageLoaded = true;
    this.cdr.markForCheck();
  }

  onImageError(): void {
    this.imageLoaded = false;
  }

  onCardClick(): void {
    if (!this.showAdminActions) {
      this.productClicked.emit(this.product);
    }
  }

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.editProduct.emit(this.product);
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.deleteProduct.emit(this.product);
  }
}
