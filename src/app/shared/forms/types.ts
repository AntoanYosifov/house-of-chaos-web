import {AsyncValidatorFn, ValidatorFn} from "@angular/forms";

export enum FormType {
    Login = 'Login',
    Register = 'Register'
}

export type FieldKind =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'checkbox'
    | 'select'
    | 'date';

export interface FieldSpec<T = any> {
    kind: FieldKind,
    initial: T,
    validators?: ValidatorFn | ValidatorFn[],
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[]
}

export type GroupSpec = {
    [key: string]: FieldSpec | GroupSpec;
}

export interface FormSchema {
    type: FormType;
    spec: GroupSpec;
}

