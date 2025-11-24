import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {ApiUserResponseModel, UserAppModel, ApiRegistrationRequestModel, ApiUserUpdateModel} from "../../models/user";
import {mapApiUserResponseToUser} from "../utils";
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class UserService {

    private apiUrl: string = 'http://localhost:8080/api/v1';

    constructor(private httpClient: HttpClient, private authService: AuthService) {
    }

    register$(user: ApiRegistrationRequestModel): Observable<ApiUserResponseModel> {
        return this.httpClient.post<ApiUserResponseModel>(`${this.apiUrl}/users/register`, user)
    }

    getProfile$(): Observable<UserAppModel> {
        return this.httpClient.get<ApiUserResponseModel>(`${this.apiUrl}/users/profile`)
            .pipe(
                map(res => mapApiUserResponseToUser(res))
            );
    }

    getAll$(): Observable<UserAppModel[]> {
        return this.httpClient.get<ApiUserResponseModel[]>(`${this.apiUrl}/admin/users`)
            .pipe(
                map(res => res.map(u => mapApiUserResponseToUser(u)))
            )
    }

    updateProfile$(updateInfo: ApiUserUpdateModel):Observable<UserAppModel> {
        return this.httpClient.put<ApiUserResponseModel>(`${this.apiUrl}/profile`, updateInfo)
            .pipe(
                map(res => mapApiUserResponseToUser(res)),
                tap(updatedUser => {
                    this.authService.setCurrentUser(updatedUser);
                })
            )
    }

    promoteToAdmin$(userId: string): Observable<UserAppModel> {
        return this.httpClient.patch<ApiUserResponseModel>(`${this.apiUrl}/admin/users/promote/${userId}`, {})
            .pipe(
                map(res => mapApiUserResponseToUser(res))
            );
    }

    demoteFromAdmin$(userId: string): Observable<UserAppModel> {
        return this.httpClient.patch<ApiUserResponseModel>(`${this.apiUrl}/admin/users/demote/${userId}`, {})
            .pipe(
                map(res => mapApiUserResponseToUser(res))
            );
    }
}