import {ApiOrderResponseModel} from "./api-order-response.model";
import {AddressModel} from "../address";

export interface ApiConfirmedOrderResponseModel {
    order: ApiOrderResponseModel;
    shippingAddress: AddressModel;
}

