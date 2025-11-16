import {ApiUserModel, UserAppModel} from "../../models/user";

export function mapApiUserToUser(apiUser: ApiUserModel): UserAppModel {
    return <UserAppModel>{
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        address: apiUser.address,
        createdOn: new Date(apiUser.createdOn),
        updatedAt: new Date(apiUser.updatedAt),
        roles: apiUser.roles
    }
}