import {Component} from '@angular/core';
import {AuthService} from "../../../core/services";
import {UserRegistrationModel} from "../../../models/user";

@Component({
    selector: 'app-register',
    imports: [],
    templateUrl: './register.html',
    standalone: true,
    styleUrl: './register.css'
})
export class Register {
    message: string = '';

    constructor(private auth:AuthService) {
    }

    testApi() {
        this.auth.testBackend().subscribe({
            next: res => this.message = JSON.stringify(res),
            error: err => this.message = 'Error: ' + err.message
        });
    }

    testRegistration() {
        const user: UserRegistrationModel = {
            email: 'test3@gmai.com',
            password: '123123'
        }

        this.auth.testRegister(user).subscribe({
            next: res => this.message = 'Registered successfully: ' + JSON.stringify(res),
            error: err => this.message = 'Error: ' + err.message
        });
    }
}
