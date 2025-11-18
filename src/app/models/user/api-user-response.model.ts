import {AddressModel} from "../address";

export type UserRole = 'USER' | 'ADMIN'

export interface ApiUserResponseModel {
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    address: AddressModel | null,
    createdOn: string,
    updatedAt: string,
    roles: UserRole[]
}
