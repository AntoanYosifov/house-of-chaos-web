import {FormSchema, FormType} from "../../../shared/forms";

export const loginSchema: FormSchema = {
    type: FormType.Login,
    spec: {
        email: {kind: 'email', initial: ''},
        password: {kind: 'password', initial: ''}
    },
};