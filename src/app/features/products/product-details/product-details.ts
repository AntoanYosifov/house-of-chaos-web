import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ProductItem} from '../product-item/product-item';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {CartService, ProductService} from "../../../core/services";
import {ProductAppModel} from "../../../models/product";
import {distinctUntilChanged, filter, finalize, map, switchMap, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-product-details',
    imports: [ProductItem],
    templateUrl: './product-details.html',
    standalone: true,
    styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

    productId: string | null = null;
    product?: ProductAppModel;
    isAddingToCart = false;
    addToCartMessage: string | null = null;
    addToCartMessageType: 'success' | 'error' | null = null;

    private destroyRef = inject(DestroyRef)

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private location: Location,
        private cartService: CartService
    ) {
    }

    goBack(): void {
        this.location.back();
    }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    this.route.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      filter((id): id is string => !!id),
      distinctUntilChanged(),
      tap(id => {
        this.productId = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }),
      switchMap(id => this.productService.getById$(id)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(product => {
      this.product = product
    });
  }

  onAddToCart(): void {
      if (!this.productId || this.isAddingToCart) {
          return;
      }

      this.isAddingToCart = true;
      this.addToCartMessage = null;
      this.addToCartMessageType = null;

      this.cartService.addOneToCart(this.productId).pipe(
          finalize(() => {
              this.isAddingToCart = false;
          })
      ).subscribe({
          next: () => {
              const name = this.product?.name ?? 'Item';
              this.addToCartMessage = `${name} was added to your cart.`;
              this.addToCartMessageType = 'success';
          },
          error: () => {
              this.addToCartMessage = 'Unable to add this product to your cart. Please try again.';
              this.addToCartMessageType = 'error';
          }
      });
  }
}
