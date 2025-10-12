import {FieldKind, FormType} from "./types";
import {AsyncValidatorFn, ValidatorFn} from "@angular/forms";
import {emailValidator, matchFields, passwordBasicValidators} from "./validators";

export type FiledRuleContext = {
    formType: FormType;
    key: string;
    path: string;
    kind: FieldKind;
}

export type GroupRuleContext = {
    formType: FormType;
    key: string;
    path: string;
}

export type FiledRule = {
    when: (ctx: FiledRuleContext) => boolean;
    validators?: ValidatorFn[];
    asyncValidators?: AsyncValidatorFn[];
}

export type GroupRule = {
    when: (ctx: GroupRuleContext) => boolean;
    groupValidators?: ValidatorFn[];
}

export const FIELD_RULES: FiledRule[] = [
    {
        when: ({formType, key}) => (formType === FormType.Login || formType === FormType.Register)
            && key === 'email',
        validators: [emailValidator]
    },
    {
        when: ({kind, key}) =>
            kind === 'password' && (key === 'password' || key === 'confirmPassword'),
        validators: passwordBasicValidators
    }
];

export const GROUP_RULES: GroupRule[] = [
    {
        when: ({formType, key}) => formType === FormType.Register && key === 'passwords',
        groupValidators: [matchFields('password', 'confirmPassword', 'passwordMismatch')],
    }
];