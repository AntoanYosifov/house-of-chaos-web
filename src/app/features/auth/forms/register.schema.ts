import {FormSchema, FormType} from "../../../shared/forms";

export const registerSchema: FormSchema = {
    type: FormType.Register,
    spec: {
        email: {kind: 'email', initial: ''},
        passwords: {
            password: {kind: 'password', initial: ''},
            confirmPassword: {kind: 'password', initial: ''}
        }
    }
}