import {AddressModel} from "../address";

export interface ApiUserUpdateModel {
    firstName: string,
    lastName: string,
    address: AddressModel
}