export interface CartItemAppModel {
    id: string;
    productId: string;
    productName: string;
    productSlug?: string;
    thumbnailUrl?: string;
    unitPrice: number;
    quantity: number;
    lineTotal?: number;
    availableStock?: number;
    currency?: string;
}