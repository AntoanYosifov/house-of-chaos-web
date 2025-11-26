export interface OrderItemAppModel {
    id: string;
    productId: number;
    productName: string;
    unitPrice: number,
    imgUrl: string;
    quantity: number;
    lineTotal: number;
}