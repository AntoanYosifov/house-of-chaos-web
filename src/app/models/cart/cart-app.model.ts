import { CartItemAppModel } from './cart-item-app.model';

export interface CartAppModel {
    id: string;
    ownerId: string;
    items: CartItemAppModel[];
}