import {AddressModel} from "../address";
import {OrderItemAppModel} from "./order-item-app.model";

export interface ApiOrderResponseModel {
    id: string;
    ownerId: string;
    status: string;
    createdOn: string;
    updatedAt: string;
    total: number;
    shippingAddress: AddressModel | null;
    items: OrderItemAppModel[];
}