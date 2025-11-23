import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ApiUserUpdateModel, UserAppModel} from "../../models/user";
import {UserService} from "../../core/services";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
    selector: 'app-profile',
    imports: [
        DatePipe,
        ReactiveFormsModule
    ],
    templateUrl: './profile.html',
    standalone: true,
    styleUrl: './profile.css'
})
export class Profile implements OnInit {

    profile: UserAppModel | null = null;
    loading: boolean = true;
    private destroyRef = inject(DestroyRef)
    personalInfoForm: FormGroup;
    isEditMode: boolean = false;
    showSuccessBanner: boolean = false;
    isHidingBanner: boolean = false;

    constructor(private userService: UserService, private formBuilder: FormBuilder) {
        this.personalInfoForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: this.formBuilder.group({
                country: ['', Validators.required],
                city: ['', Validators.required],
                zip: ['', Validators.required],
                street: ['', Validators.required],
            })
        })
    }

    ngOnInit(): void {
        this.loading = true;
        this.userService.getProfile$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: res => {
                this.profile = res;
                this.loading = false;
            },
            error: (err) => {
                this.profile = null;
                this.loading = false;
                console.error(err);
            }
        });
    }

    get firstName(): AbstractControl<any, any> | null {
        return this.personalInfoForm.get('firstName');
    }

    get lastName(): AbstractControl<any, any> | null {
        return this.personalInfoForm.get('lastName');
    }

    get addressGroup(): FormGroup {
        return this.personalInfoForm.get('address') as FormGroup;
    }

    get country(): AbstractControl<any, any> | null {
        return this.addressGroup.get('country');
    }

    get city(): AbstractControl<any, any> | null {
        return this.addressGroup.get('city');
    }

    get zip(): AbstractControl<any, any> | null {
        return this.addressGroup.get('zip');
    }

    get street(): AbstractControl<any, any> | null {
        return this.addressGroup.get('street');
    }

    get isFirstNameNotValid(): boolean {
        return this.firstName?.invalid && (this.firstName?.dirty || this.firstName?.touched) || false;
    }

    get isLastNameNotValid(): boolean {
        return this.lastName?.invalid && (this.lastName?.dirty || this.lastName?.touched) || false;
    }

    get isCountryNotValid(): boolean {
        return this.country?.invalid && (this.country?.dirty || this.country?.touched) || false;
    }

    get isCityNotValid(): boolean {
        return this.city?.invalid && (this.city?.dirty || this.city?.touched) || false;
    }

    get isZipNotValid(): boolean {
        return this.zip?.invalid && (this.zip?.dirty || this.zip?.touched) || false;
    }

    get isStreetNotValid(): boolean {
        return this.street?.invalid && (this.street?.dirty || this.street?.touched) || false;
    }

    get firstNameErrorMessage(): string {
        if (this.firstName?.errors?.['required']) {
            return 'Your first name is required!';
        }

        return '';
    }

    get lastNameErrorMessage(): string {
        if (this.lastName?.errors?.['required']) {
            return 'Your last name is required!';
        }

        return '';
    }

    get countryErrorMessage(): string {
        if (this.country?.errors?.['required']) {
            return 'Your country is required!';
        }

        return '';
    }

    get cityErrorMessage(): string {
        if (this.city?.errors?.['required']) {
            return 'Your city is required!';
        }

        return '';
    }

    get zipErrorMessage(): string {
        if (this.zip?.errors?.['required']) {
            return 'Your zip code is required!';
        }

        return '';
    }

    get streetErrorMessage(): string {
        if (this.street?.errors?.['required']) {
            return 'Your street is required!';
        }

        return '';
    }

    get isProfileComplete(): boolean {
        return !!(this.profile?.firstName && this.profile?.lastName && this.profile?.address);
    }


    onEdit() {
        const user = this.profile

        this.personalInfoForm.patchValue({
            firstName: user?.firstName,
            lastName: user?.lastName,
            address: user?.address
        });
        this.isEditMode = true;
    }

    onCancel(): void {
        this.isEditMode = false;
        this.personalInfoForm.reset();
    }

    onSave() {
        if (this.personalInfoForm.valid) {
            const wasIncomplete = !this.isProfileComplete;
            const {firstName, lastName, address} = this.personalInfoForm.value;

            const updateInfo = <ApiUserUpdateModel>{
                firstName: firstName,
                lastName: lastName,
                address: address
            };

            this.userService.updateProfile$(updateInfo)
                .subscribe({
                    next: updatedUser => {
                        this.profile = updatedUser;
                        this.isEditMode = false;
                        this.personalInfoForm.reset();
                        
                        // Show success banner if profile was just completed
                        if (wasIncomplete && this.isProfileComplete) {
                            this.showSuccessBanner = true;
                            this.isHidingBanner = false;
                            setTimeout(() => {
                                this.isHidingBanner = true;
                                setTimeout(() => {
                                    this.showSuccessBanner = false;
                                }, 400); // Wait for fade-out animation to complete
                            }, 4000); // Show for 4 seconds
                        }
                    },
                    error: err => console.error(err)
                });
        }
    }

}
