import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserLoginModel, UserRegistrationModel} from "../../models/user";

@Injectable({providedIn: 'root'})
export class AuthService {
    private baseUrl = 'http://localhost:8080/users';

    constructor(private httpClient: HttpClient) {}

    register$(user: UserRegistrationModel): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/register`, user)
    }

    login$(user: UserLoginModel): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/login`, user)
    }


}