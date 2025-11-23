export interface ApiProductCreateRequestModel {
    name: string,
    description: string,
    price: number,
    quantity: number,
    imgUrl: string,
    categoryId: string
}
