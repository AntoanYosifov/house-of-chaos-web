import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserRegistrationModel} from "../../models/user";

@Injectable({providedIn: 'root'})
export class AuthService {
    private baseUrl = 'http://localhost:8080/users';

    constructor(private httpClient: HttpClient) {
    }

    testBackend(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/free`, {
            responseType: 'text'
        })
    }

    testRegister(user: UserRegistrationModel): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/register`, user)
    }

    testLogin(user: UserRegistrationModel): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/login`, user)
    }
}