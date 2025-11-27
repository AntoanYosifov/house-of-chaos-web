export interface OrderItemAppModel {
    id: string;
    productId: string;
    productName: string;
    unitPrice: number;
    imgUrl: string;
    quantity: number;
    lineTotal: number;
}