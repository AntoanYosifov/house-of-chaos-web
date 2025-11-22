import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryModel} from "../../models/category";

@Injectable({providedIn: 'root'})
export class CategoryService {
    private apiUrl = 'http://localhost:8080/api/v1/categories';

    constructor(private httpClient: HttpClient) {
    }

    getCategories$(): Observable<CategoryModel[]> {
        return this.httpClient.get<CategoryModel[]>(this.apiUrl)
    }
}