import {Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ProductAppModel} from '../../../models/product';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  standalone: true,
  styleUrl: './product-card.css'
})
export class ProductCard implements OnInit, OnChanges {
  @Input({required: true}) product!: ProductAppModel;
  @Input() showAdminActions: boolean = false;
  @Input() size: 'default' | 'compact' = 'default';
  @Input() index: number = 0;

  @Output() productClicked = new EventEmitter<ProductAppModel>();
  @Output() editProduct = new EventEmitter<ProductAppModel>();
  @Output() deleteProduct = new EventEmitter<ProductAppModel>();

  imageLoaded: boolean = false;
  cardVisible: boolean = false;

  ngOnInit(): void {
    this.preloadImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && !changes['product'].firstChange) {
      this.imageLoaded = false;
      this.cardVisible = false;
      this.preloadImage();
    }
  }

  private preloadImage(): void {
    if (this.product?.id && this.product?.imgUrl) {
      const img = new Image();
      const showCard = () => {
        setTimeout(() => {
          this.cardVisible = true;
        }, this.index * 30);
      };

      img.onload = () => {
        this.imageLoaded = true;
        showCard();
      };
      img.onerror = () => {
        this.imageLoaded = false;
        showCard();
      };

      img.src = this.product.imgUrl;

      if (img.complete && img.naturalWidth > 0) {
        this.imageLoaded = true;
        showCard();
      }
    } else {
      if (this.product?.id) {
        setTimeout(() => {
          this.cardVisible = true;
        }, this.index * 30);
      }
    }
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageLoaded = false;
    this.cardVisible = true;
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
