import {ApiAccessTokenModel} from "./api-access-token.model";
import {ApiUserModel} from "./api-user.model";

export interface ApiLoginResponseModel {
    access_token: ApiAccessTokenModel,
    user: ApiUserModel,
}