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