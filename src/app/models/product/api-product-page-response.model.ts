import {ProductAppModel} from './product-app.model';

export interface PageInfoModel {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface ProductPageResponseModel {
    content: ProductAppModel[];
    page: PageInfoModel;
}
