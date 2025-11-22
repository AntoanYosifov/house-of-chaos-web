import {Component} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {UserService} from '../../../core/services';
import {ApiUserResponseModel, ApiRegistrationRequest} from "../../../models/user";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class Register {

    registerForm: FormGroup;

    emailTakenError: string | null = null;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(20),
                    Validators.pattern(/^[a-zA-Z0-9]+$/)]],
                confirmPassword: ['', [Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(20),
                    Validators.pattern(/^[a-zA-Z0-9]+$/)]]

            }, {validators: this.passwordMatchValidator})
        });
    }

    get email(): AbstractControl<any, any> | null {
        return this.registerForm.get('email');
    }

    get passwords(): FormGroup {
        return this.registerForm.get('passwords') as FormGroup;
    }

    get password(): AbstractControl<any, any> | null {
        return this.passwords.get('password');
    }

    get confirmPassword(): AbstractControl<any, any> | null {
        return this.passwords.get('confirmPassword');
    }

    get isEmailNotValid(): boolean {
        return (this.email?.invalid && (this.email?.dirty || this.email?.touched)) || false;
    }

    get isPasswordNotValid(): boolean {
        return (this.password?.invalid && (this.password?.dirty || this.password?.touched)) || false;
    }


    get isConfirmPasswordNotValid(): boolean {
        return (this.confirmPassword?.invalid && (this.confirmPassword?.dirty || this.confirmPassword?.touched)) || false;
    }


    get isPasswordsMismatch(): boolean {
        const mismatch = this.passwords.hasError('passwordMismatch');
        const reTouched = this.confirmPassword?.dirty || this.confirmPassword?.touched;
        return !!(mismatch && reTouched);
    }

    get emailErrorMessage(): string {
        if (this.email?.errors?.['required']) {
            return 'Email is required';
        }
        if (this.email?.errors?.['pattern']) {
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
        if (this.password?.errors?.['maxlength']) { // note: 'maxlength' (lowercase L)
            return 'Password cannot exceed 20 characters!';
        }
        if (this.password?.errors?.['pattern']) {
            return 'Password must contain only Latin letters and numbers (no spaces or special characters).';
        }
        return '';
    }

    get confirmPasswordErrorMessage(): string {
        if (this.confirmPassword?.errors?.['required']) {
            return 'You must confirm your password!';
        }
        if (this.confirmPassword?.errors?.['minlength']) {
            return 'Password must be at least 5 characters!';
        }
        if (this.confirmPassword?.errors?.['maxlength']) {
            return 'Password cannot exceed 20 characters!';
        }
        if (this.confirmPassword?.errors?.['pattern']) {
            return 'Password must contain only Latin letters and numbers (no spaces or special characters).';
        }
        return '';
    }

    get passwordsMismatchErrorMessage(): string {
        return 'Passwords do not match!';
    }

    private passwordMatchValidator(passwordsControl: AbstractControl): ValidationErrors | null {
        const password = passwordsControl.get('password');
        const confirmPassword = passwordsControl.get('confirmPassword');

        if(password && confirmPassword && password.value !== confirmPassword.value) {
            return {passwordMismatch: true}
        }

        return null;
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const {email, passwords} = this.registerForm.value as {
            email: string;
            passwords: { password: string; confirmPassword: string };
        };

        const userData: ApiRegistrationRequest = {
            email,
            password: passwords.password,
            confirmPassword: passwords.confirmPassword,
        };

        this.userService.register$(userData).subscribe({
            next: (res:ApiUserResponseModel) => {
                this.router.navigate(['/login'], {
                    state: {justRegistered: true, email: res.email}
                })
            },
            error: (err: HttpErrorResponse) => {

                if (err.status === 409 && err.error?.title === 'Email Already In Use') {
                    this.emailTakenError = 'This email is already registered. Please use another one.';
                    return;
                }

                console.error(err);
            }
        });
    }
}
