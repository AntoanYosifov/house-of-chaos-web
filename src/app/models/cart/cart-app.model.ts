import { CartItemAppModel } from './cart-item-app.model';

export interface CartAppModel {
    id: string;
    ownerId: string;
    items: CartItemAppModel[];
    currency?: string;
    totalQuantity?: number;
    totalPrice?: number;
    updatedAt?: string;
}