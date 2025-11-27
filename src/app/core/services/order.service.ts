import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {OrderAppModel} from "../../models/order/order-app.model";
import {ApiOrderRequestModel} from "../../models/order/api-order-request.model";
import {ApiOrderResponseModel} from "../../models/order/api-order-response.model";
import {AddressModel} from "../../models/address";
import {ApiConfirmedOrderResponseModel} from "../../models/order/api-confirmed-order-response.model";

@Injectable({providedIn: 'root'})
export class OrderService {
    private apiUrl:string = 'http://localhost:8080/api/v1/orders';

    constructor(private httpClient: HttpClient) {
    }

    create$(apiOrderRequest: ApiOrderRequestModel): Observable<OrderAppModel> {
        return this.httpClient.post<ApiOrderResponseModel>(`${this.apiUrl}`, apiOrderRequest).pipe(
            map(apiResponse => this.mapApiModelToAppModel(apiResponse))
        );
    }

    getOrderById$(orderId: string): Observable<OrderAppModel> {
        return this.httpClient.get<ApiOrderResponseModel>(`${this.apiUrl}/${orderId}`).pipe(
            map(apiResponse => this.mapApiModelToAppModel(apiResponse))
        );
    }

    getNewOrders$(): Observable<OrderAppModel[]> {
        return this.httpClient.get<ApiOrderResponseModel[]>(`${this.apiUrl}/new`).pipe(
            map(apiResponses => apiResponses.map(api => this.mapApiModelToAppModel(api)))
        );
    }

    confirmOrder$(orderId: string, shippingAddress: AddressModel): Observable<OrderAppModel> {
        return this.httpClient.patch<ApiConfirmedOrderResponseModel>(`${this.apiUrl}/confirm/${orderId}`, shippingAddress).pipe(
            map(apiResponse => this.mapApiModelToAppModel(apiResponse.order))
        );
    }

    deleteOrder$(orderId: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/${orderId}`);
    }

    cancelOrder$(orderId: string): Observable<OrderAppModel> {
        return this.httpClient.post<ApiOrderResponseModel>(`${this.apiUrl}/cancel/${orderId}`, {}).pipe(
            map(apiResponse => this.mapApiModelToAppModel(apiResponse))
        );
    }

    private mapApiModelToAppModel(apiOrderResponseModel: ApiOrderResponseModel): OrderAppModel {
        return {
            id: apiOrderResponseModel.id,
            ownerId: apiOrderResponseModel.ownerId,
            status: apiOrderResponseModel.status,
            createdOn: new Date(apiOrderResponseModel.createdOn),
            updatedAt: new Date(apiOrderResponseModel.updatedAt),
            total: apiOrderResponseModel.total,
            shippingAddress: apiOrderResponseModel.shippingAddress,
            items: apiOrderResponseModel.items
        };
    }
}