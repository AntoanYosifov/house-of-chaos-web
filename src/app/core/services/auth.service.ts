import {Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {ApiAccessTokenModel, ApiLoginRequest, ApiLoginResponseModel, UserAppModel} from "../../models/user";
import {mapApiUserResponseToUser} from "../utils";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
    private apiUrl:string = 'http://localhost:8080/api/v1/auth';

    private _isLoggedIn = signal<boolean>(false);
    private _currentUser = signal<UserAppModel | null>(null);

    public isLoggedIn = this._isLoggedIn.asReadonly();
    public currentUser = this._currentUser.asReadonly();

    constructor(private httpClient: HttpClient, private router: Router) {
        const accessToken = localStorage.getItem('access_token');
        const cachedUser = localStorage.getItem('currentUser');
        if (accessToken && cachedUser) {
            try {
                this._currentUser.set(JSON.parse(cachedUser))
            } catch {}
            this._isLoggedIn.set(true);
        }
    }

    login$(userLoginModel: ApiLoginRequest): Observable<UserAppModel> {
        return this.httpClient.post<ApiLoginResponseModel>(`${this.apiUrl}/login`, userLoginModel, {withCredentials: true})
            .pipe(
                tap(res => {
                    localStorage.setItem('access_token', res.access_token.access_token)
                }),
                map(res =>  mapApiUserResponseToUser(res.user)),
                tap(userAppModel => {
                   this.setCurrentUser(userAppModel)
                })
            );
    }

    setCurrentUser(user: UserAppModel) {
        this._currentUser.set(user);
        this._isLoggedIn.set(true);
        localStorage.setItem('currentUser', JSON.stringify(user))
    }

    clientOnlyLogout() {
        this._currentUser.set(null);
        this._isLoggedIn.set(false);
        this.clearLocalStorage();
        this.router.navigate(['/login'])
    }

    logout$ (): Observable<any> {
        return  this.httpClient.post(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        }).pipe(
            tap(() => {
               this.clientOnlyLogout();
            })
        )
    }

    getFreshAccessToken$() {
        return this.httpClient.post<ApiAccessTokenModel>(`${this.apiUrl}/refresh`, {},
            {withCredentials: true})
            .pipe(
                map(res => res.access_token),
                tap(token => localStorage.setItem('access_token', token))
            );
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private clearLocalStorage() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
    }

}