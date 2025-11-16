import {Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {UserLoginModel, UserRegistrationModel} from "../../models/user";
import {UserAppModel} from "../../models/user";
import {ApiLoginResponseModel} from "../../models/user";
import {ApiUserModel} from "../../models/user";
import {ApiAccessTokenModel} from "../../models/user";

@Injectable({providedIn: 'root'})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/users';

    private _isLoggedIn = signal<boolean>(false);
    private _currentUser = signal<UserAppModel | null>(null);

    public isLoggedIn = this._isLoggedIn.asReadonly();
    public currentUser = this._currentUser.asReadonly();

    constructor(private httpClient: HttpClient) {
        const accessToken = localStorage.getItem('access_token');
        const cachedUser = localStorage.getItem('currentUser');
        if (accessToken && cachedUser) {
            try {
                this._currentUser.set(JSON.parse(cachedUser))
            } catch {}
            this._isLoggedIn.set(true);
        }
    }

    register$(user: UserRegistrationModel): Observable<ApiUserModel> {
        return this.httpClient.post<ApiUserModel>(`${this.apiUrl}/register`, user)
    }

    login$(userLoginModel: UserLoginModel): Observable<UserAppModel> {
        return this.httpClient.post<ApiLoginResponseModel>(`${this.apiUrl}/auth/login`, userLoginModel, {withCredentials: true})
            .pipe(
                tap(res => {
                    localStorage.setItem('access_token', res.access_token.access_token)
                }),
                map(res => this.mapApiUserToUser(res.user)),
                tap(userAppModel => {
                    this._currentUser.set(userAppModel);
                    this._isLoggedIn.set(true);
                    localStorage.setItem('currentUser', JSON.stringify(userAppModel))
                })
            );
    }

    clientOnlyLogout() {
        this._currentUser.set(null);
        this._isLoggedIn.set(false);
        this.clearLocalStorage();
    }

    logout$ (): Observable<any> {
        return  this.httpClient.post(`${this.apiUrl}/auth/logout`, {}, {
            withCredentials: true
        }).pipe(
            tap(() => {
               this.clientOnlyLogout();
            })
        )
    }

    getFreshAccessToken$() {
        return this.httpClient.post<ApiAccessTokenModel>(`${this.apiUrl}/auth/refresh`, {},
            {withCredentials: true})
            .pipe(
                map(res => res.access_token),
                tap(token => localStorage.setItem('access_token', token))
            );
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private mapApiUserToUser(apiUser: ApiUserModel): UserAppModel {
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

    private clearLocalStorage() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
    }

}