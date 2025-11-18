import {UserRole} from "./api-user-response.model";
import {AddressModel} from "../address";

export interface UserAppModel {
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    address: AddressModel | null,
    createdOn: Date,
    updatedAt: Date,
    roles: UserRole[]
}
