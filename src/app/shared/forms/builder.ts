import {FieldKind, FieldSpec, FormSchema, GroupSpec} from "./types";
import {AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {FIELD_RULES, FieldRuleContext, GROUP_RULES, GroupRuleContext} from "./rules";



export function buildFormGroup(schema: FormSchema, fb: FormBuilder): FormGroup {
    const { spec, type: formType } = schema;
    return buildGroup(spec, formType, fb, '');
}

function buildGroup(spec: GroupSpec, formType: any, fb: FormBuilder, parentPath: string): FormGroup {
    const controls: Record<string, any> = {};

    for (const key of Object.keys(spec)) {
        const node = spec[key] as FieldSpec | GroupSpec;
        const path = parentPath ? `${parentPath}.${key}` : key;

        if (isFieldSpec(node)) {
            const baseVal = toArray<ValidatorFn>(node.validators);
            const baseAsync = toArray<AsyncValidatorFn>(node.asyncValidators);

            const ctx: FieldRuleContext = {formType, key, path, kind: node.kind as FieldKind}
            const mathed = FIELD_RULES.filter(r => r.when(ctx));

            let ruleVal: ValidatorFn[] = [];
            let ruleAsync: AsyncValidatorFn[] = [];

            for (const r of mathed) {
                if(r.validators) {
                    ruleVal = ruleVal.concat(r.validators);
                }
                if(r.asyncValidators) {
                    ruleAsync = ruleAsync.concat(r.asyncValidators);
                }
            }

            const validators = composeFns([...baseVal, ...ruleVal]);
            const asyncValidators = composeAsyncFns([...baseAsync, ...ruleAsync]);

            controls[key] = new FormControl(node.initial, {validators, asyncValidators, updateOn: 'change'});
        } else {
            const childGroup = buildGroup(node as GroupSpec, formType, fb, path);
            const gctx: GroupRuleContext = { formType, key, path };
            const matchedG = GROUP_RULES.filter((r) => r.when(gctx));

            let groupVal: ValidatorFn[] = [];
            for (const r of matchedG) {
                if (r.groupValidators) {
                    groupVal = groupVal.concat(r.groupValidators);
                }
            }

            const groupValidators = composeFns(groupVal);
            if (groupValidators) {
                childGroup.setValidators(groupValidators);
                childGroup.updateValueAndValidity({ emitEvent: false });
            }
            controls[key] = childGroup;
        }
    }
    return fb.group(controls);
}


export function isFieldSpec(node: FieldSpec | GroupSpec): node is FieldSpec {
    const anyNode = node as any;
    if(typeof anyNode !== 'object' || anyNode == null) {
        return false;
    }
    const hasKind = typeof anyNode.kind === 'string';
    const hasInitial = 'initial' in anyNode;
    return hasKind && hasInitial;
}

export function toArray<T>(value?: T | T[]): T[] {
    if(value == null) {
        return [];
    }
    if(Array.isArray(value)) {
        return value;
    }
    return [value];
}

export function composeFns(fns: ValidatorFn[] | undefined): ValidatorFn | null {
    if(!fns) {
        return null;
    }
    if(fns.length === 0) {
        return null;
    }
    return Validators.compose(fns);
}

export function composeAsyncFns(fns: AsyncValidatorFn[] | undefined): AsyncValidatorFn | null {
    if(!fns) {
        return null;
    }
    if(fns.length === 0) {
        return null;
    }
    return Validators.composeAsync(fns);
}