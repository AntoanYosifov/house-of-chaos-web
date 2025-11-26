import {AddressModel} from "../address";
import {OrderItemAppModel} from "./order-item-app.model";

export interface OrderAppModel {
    id: string;
    ownerId: string;
    status: string;
    createdOn: Date;
    updatedAt: Date;
    total: number;
    shippingAddress: AddressModel | null
    items: OrderItemAppModel[]
}