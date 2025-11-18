import {ApiUserResponseModel, UserAppModel} from "../../models/user";

export function mapApiUserResponseToUser(apiUser: ApiUserResponseModel): UserAppModel {
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