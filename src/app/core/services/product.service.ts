import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ProductAppModel, ApiProductCreateRequestModel} from "../../models/products";
import {ApiImgbbResposneModel} from "../../models/products/api-imgbb-resposne.model";

@Injectable({providedIn: "root"})
export class ProductService {
    private apiUrl:string = 'http://localhost:8080/api/v1';
    constructor(private httpClient: HttpClient ) {}

    getById$(id: string) : Observable<ProductAppModel> {
        return  this.httpClient.get<ProductAppModel>(`${this.apiUrl}/products/${id}`);
    }

    addProduct$(productCreateModel: ApiProductCreateRequestModel ) : Observable<ProductAppModel> {
        return this.httpClient.post<ProductAppModel>(`${this.apiUrl}/admin/products`, productCreateModel);
    }

    uploadProductImage$(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('image', file)

        return this.httpClient.post<ApiImgbbResposneModel>("https://api.imgbb.com/1/upload?key=1a4fa9707ef1791146e7737929571b4d", formData)
            .pipe(
                map(res => res.data.url)
            );
    }
}