import {UserRole} from "./api-user.model";

export interface UserAppModel {
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    address: string | null,
    createdOn: Date,
    updatedAt: Date,
    roles: UserRole[]
}
