import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {ApiUserResponseModel, UserAppModel, ApiRegistrationRequest, ApiUserUpdateModel} from "../../models/user";
import {mapApiUserResponseToUser} from "../utils";
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class UserService {

    private apiUrl: string = 'http://localhost:8080/api/v1/users';

    constructor(private httpClient: HttpClient, private authService: AuthService) {
    }

    register$(user: ApiRegistrationRequest): Observable<ApiUserResponseModel> {
        return this.httpClient.post<ApiUserResponseModel>(`${this.apiUrl}/register`, user)
    }

    getProfile$(): Observable<UserAppModel> {
        return this.httpClient.get<ApiUserResponseModel>(`${this.apiUrl}/profile`)
            .pipe(
                map(res => mapApiUserResponseToUser(res))
            );
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
}