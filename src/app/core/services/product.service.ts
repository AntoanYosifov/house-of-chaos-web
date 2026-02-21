import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
    ApiProductCreateRequestModel,
    ApiProductUpdateModel,
    ProductAppModel,
    ProductPageResponseModel
} from "../../models/product";

@Injectable({providedIn: "root"})
export class ProductService {
    private apiUrl: string = 'http://localhost:8080/api/v1';

    constructor(private httpClient: HttpClient) {
    }

    getById$(id: string): Observable<ProductAppModel> {
        return this.httpClient.get<ProductAppModel>(`${this.apiUrl}/products/${id}`);
    }

    getByCategory$(categoryId: string, page: number = 0, size: number = 8): Observable<ProductPageResponseModel> {
        return this.httpClient.get<ProductPageResponseModel>(
            `${this.apiUrl}/products?categoryId=${categoryId}&page=${page}&size=${size}`
        );
    }

    getNewArrivals(): Observable<ProductAppModel[]> {
        return this.httpClient.get<ProductAppModel[]>(`${this.apiUrl}/products/new-arrivals`)
    }
    getTopDeals(): Observable<ProductAppModel[]> {
        return this.httpClient.get<ProductAppModel[]>(`${this.apiUrl}/products/top-deals`)
    }

    addProduct$(productCreateModel: ApiProductCreateRequestModel, image: File): Observable<ProductAppModel> {
        const formData = new FormData();

        formData.append('name', productCreateModel.name);
        formData.append('description', productCreateModel.description);
        formData.append('price', String(productCreateModel.price));
        formData.append('quantity', String(productCreateModel.quantity));
        formData.append('categoryId', productCreateModel.categoryId);
        formData.append('file', image);
        return this.httpClient.post<ProductAppModel>(`${this.apiUrl}/admin/products`, formData);
    }

    updateProduct$(id: string, updateModel: ApiProductUpdateModel): Observable<ProductAppModel> {
        return this.httpClient.patch<ProductAppModel>(`${this.apiUrl}/admin/products/${id}`, updateModel);
    }

    deleteProduct$(id: string): Observable<void> {
       return this.httpClient.delete<void>(`${this.apiUrl}/admin/products/${id}`)
    }

}