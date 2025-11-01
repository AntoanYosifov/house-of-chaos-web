import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductCreateModel, ProductAppModel} from "../../models/products";

@Injectable({providedIn: "root"})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products';
    constructor(private httpClient: HttpClient ) {}

    getById$() : Observable<ProductAppModel> {
        return  this.httpClient.get<ProductAppModel>(`${this.apiUrl}/5c33122b-162b-474e-9172-6b8ffc936496`);
    }

    addProduct$(productCreateModel: ProductCreateModel ) : Observable<ProductAppModel> {
        return this.httpClient.post<ProductAppModel>(`${this.apiUrl}`, productCreateModel);
    }
}