import {ApiAccessTokenModel} from "./api-access-token.model";
import {ApiUserResponseModel} from "./api-user-response.model";

export interface ApiLoginResponseModel {
    access_token: ApiAccessTokenModel,
    user: ApiUserResponseModel,
}