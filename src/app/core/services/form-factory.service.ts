import {Injectable} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FormSchema} from "../../shared/forms";
import {buildFormGroup} from "../../shared/forms/builder";

@Injectable({providedIn: 'root'})
export class FormFactoryService {
    constructor(private fb: FormBuilder) {}

    create(schema: FormSchema): FormGroup {
        return buildFormGroup(schema, this.fb);
    }
}