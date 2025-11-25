import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CartAppModel} from "../../models/cart";

@Injectable({providedIn: 'root'})
export class CartService {
    private apiUrl:string = 'http://localhost:8080/api/v1/cart';

    constructor(private httpClient: HttpClient) {
    }

    getCart$(): Observable<CartAppModel> {
        return this.httpClient.get<CartAppModel>(`${this.apiUrl}`)
    }

    addOneToCart(productId: string): Observable<CartAppModel> {
        return this.httpClient.put<CartAppModel>(`${this.apiUrl}/${productId}`, {})
    }

}