import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiCategoryCreateRequestModel, CategoryModel} from "../../models/category";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class CategoryService {
    private apiUrl = `${environment.apiUrl}/api/v1`;

    constructor(private httpClient: HttpClient) {
    }

    getAll$(): Observable<CategoryModel[]> {
        return this.httpClient.get<CategoryModel[]>(`${this.apiUrl}/categories`)
    }

    addCategory$(categoryCreateModel: ApiCategoryCreateRequestModel): Observable<CategoryModel> {
        return this.httpClient.post<CategoryModel>(`${this.apiUrl}/admin/categories`, categoryCreateModel)
    }

    deleteCategory$(categoryId: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/admin/categories/${categoryId}`);
    }
}