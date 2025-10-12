import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const latinAlnumRegex = /^[a-zA-Z0-9]+$/;

export const emailValidator: ValidatorFn = (c) => {
    const v = c.value as string | null | undefined;
    if (!v || v.length === 0) {
        return {required: true}
    }
    if (!emailRegex.test(v)) {
        return {email: true}
    }
    return null;
}

export const passwordBasicValidators: ValidatorFn[] = [
    (c) => {
        const v = c.value as string | null | undefined;
        if (!v || v.length === 0) {
            return {required: true}
        }
        return null;
    },
    (c) => {
        const v = c.value as string;
        if (v && v.length < 5) {
            return {minlength: {requiredLength: 5, actualLength: v.length}}
        }
        return null;
    },
    (c) => {
        const v = c.value as string;
        if (v && v.length > 20) {
            return {maxlength: {requiredLength: 20, actualLength: v.length}};
        }
        return null;
    },
    (c) => {
        const v = c.value as string;
        if(v && !latinAlnumRegex.test(v)) {
            return {pattern: 'latinAlnum'};
        }
        return null;
    }
]

export function matchFields(a: string, b: string, errorKey = 'mismatch'): ValidatorFn {
    return function (group: AbstractControl): ValidationErrors | null {
        const va = group.get(a)?.value;
        const vb = group.get(b)?.value;
        if (va == null || vb == null) {
            return null;
        }
        return va !== vb ? {[errorKey]: true} : null;
    };
}
