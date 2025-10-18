import {Component} from '@angular/core';
import {AbstractControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthService, FormFactoryService} from "../../../../core/services";
import {Router, RouterLink} from "@angular/router";
import {UserLoginModel} from "../../../../models/user";
import {loginSchema} from "../../forms";
import {routes} from "../../../../app.routes";

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './login.html',
    standalone: true,
    styleUrl: './login.css'
})
export class Login {
    loginForm: FormGroup;

    constructor(private auth: AuthService, private formsService: FormFactoryService, private router: Router) {
        this.loginForm = this.formsService.create(loginSchema);
    }

    get email(): AbstractControl<any, any> | null {
        return this.loginForm.get('email');
    }

    get password(): AbstractControl<any, any> | null {
        return this.loginForm.get('password');
    }

    get isEmailNotValid(): boolean {
        return this.email?.invalid && (this.email?.dirty || this.email?.touched) || false;
    }

    get isPasswordNotValid(): boolean {
        return this.password?.invalid && (this.password?.dirty || this.password?.touched) || false;
    }

    get emailErrorMessage(): string {
        if (this.email?.errors?.['required']) {
            return 'Email is required';
        }

        if (this.email?.errors?.['email']) {
            return 'Email is not valid';
        }

        return '';
    }

    get passwordErrorMessage(): string {
        if (this.password?.errors?.['required']) {
            return 'Password is required';
        }

        if (this.password?.errors?.['minlength']) {
            return 'Password must be at least 5 characters!';
        }

        if (this.password?.errors?.['maxlength']) {
            return 'Password can not exceed 20 characters!';
        }

        if (this.password?.errors?.['password']) {
            return 'Password must contain only Latin letters and numbers (no spaces or special characters).';
        }

        return '';
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const {email, password} = this.loginForm.value;

        const userData: UserLoginModel = {
            email,
            password,
        }

        this.auth.login$(userData).subscribe({
            next: () =>{ this.router.navigate(['/home'])},
            error: err => {
                console.log('Login failed: ', err);
            }
        })
    }
}
