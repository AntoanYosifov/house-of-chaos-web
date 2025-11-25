import {Injectable, signal} from "@angular/core";
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CartAppModel} from "../../models/cart";

@Injectable({providedIn: 'root'})
export class CartService {
    private apiUrl:string = 'http://localhost:8080/api/v1/cart';
    
    private readonly _cart = signal<CartAppModel | null>(null);
    readonly cart = this._cart.asReadonly();

    constructor(private httpClient: HttpClient) {
    }

    getCart$(): Observable<CartAppModel> {
        return this.httpClient.get<CartAppModel>(`${this.apiUrl}`).pipe(
            tap(cart => this._cart.set(cart))
        );
    }

    addOneToCart$(productId: string): Observable<CartAppModel> {
        return this.httpClient.put<CartAppModel>(`${this.apiUrl}/items/${productId}`, {}).pipe(
            tap(cart => this._cart.set(cart))
        );
    }

    removeOneFromCart$(itemId: string): Observable<CartAppModel> {
        return this.httpClient.post<CartAppModel>(`${this.apiUrl}/items/${itemId}/decrease`, {}).pipe(
            tap(cart => this._cart.set(cart))
        );
    }

    deleteItem$(itemId: string): Observable<CartAppModel> {
        return this.httpClient.delete<CartAppModel>(`${this.apiUrl}/items/${itemId}`).pipe(
            tap(cart => this._cart.set(cart))
        );
    }

    getCartQuantityForProduct(productId: string): number {
        const cart = this._cart();
        if (!cart || !cart.items) {
            return 0;
        }
        const item = cart.items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    }
}