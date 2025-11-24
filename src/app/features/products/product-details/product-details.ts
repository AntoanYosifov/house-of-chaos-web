import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ProductItem} from '../product-item/product-item';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../../core/services";
import {ProductAppModel} from "../../../models/product";
import {distinctUntilChanged, filter, map, switchMap, tap} from "rxjs";
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

    private destroyRef = inject(DestroyRef)

    constructor(private productService: ProductService, private route: ActivatedRoute) {

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
}
