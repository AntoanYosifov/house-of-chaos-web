import {ValidatorFn} from "@angular/forms";

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const latinAlnumRegex = /^[a-zA-Z0-9]+$/;

export const emailValidator: ValidatorFn = (c) => {
    const v = c.value as string | null | undefined;
    if(!v || v.length === 0) {
        return {required: true}
    }
    return emailRegex.test(v) ? null : {email: true}
}

export const passwordBasicValidators: ValidatorFn[] = [
    (c) => {
        const v = c.value as string | null | undefined;
        return !v || v.length === 0 ? {required: true} : null;
    },
    (c) => {
        const v = c.value as string;
        return v && v.length < 5 ? {minlength: {requiredLength: 5, actualLength: v.length}} : null;
    },
    (c) => {
        const v = c.value as string;
        return v && v.length > 20 ? {maxlength: {requiredLength: 20, actualLength: v.length}} : null;
    },
    (c) => {
        const v = c.value as string;
        return v && !latinAlnumRegex.test(v) ? {pattern: 'latinAlnum'} : null
    }
]

