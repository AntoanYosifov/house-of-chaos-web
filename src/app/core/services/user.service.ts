import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ApiUserModel, UserAppModel, UserRegistrationModel} from "../../models/user";
import {mapApiUserToUser} from "../utils";

@Injectable({providedIn: 'root'})
export class UserService {

    private apiUrl: string = 'http://localhost:8080/api/users';

    constructor(private httpClient: HttpClient) {
    }

    register$(user: UserRegistrationModel): Observable<ApiUserModel> {
        return this.httpClient.post<ApiUserModel>(`${this.apiUrl}/register`, user)
    }

    getProfile$(): Observable<UserAppModel> {
        return this.httpClient.get<ApiUserModel>(`${this.apiUrl}/profile`)
            .pipe(
                map(res => mapApiUserToUser(res))
            );
    }
}