import { AbstractControl, ValidatorFn } from "@angular/forms";

export function isAlphabates(control: AbstractControl): {[key: string]: any} | null {
    return (/^[a-zA-Z]+(\s[a-zA-Z]+)?$/).test(control.value) || control.value === '' ? null : {'isAlphabates': {value: control.value} };
}

export function isNumber(control: AbstractControl): {[key: string]: any} | null {
    return (/^\d+$/).test(control.value) || control.value === '' ? null : {'isNumber': {value: control.value} };
}

export function isDecimal(control: AbstractControl): {[key: string]: any} | null {
    return (/^\d+(\.\d+)?$/).test(control.value) || control.value === '' ? null : {'isDecimal': {value: control.value} };
}

export function hasLength(requiredLength: number): ValidatorFn  {
    return (control: AbstractControl): {[key: string]: any} | null => {

        let controlValue = control.value;

        if (typeof controlValue === 'string') {
            controlValue = control.value;
        } else {
            controlValue = Math.abs(control.value)
        }

        return control.value && controlValue.toString().length !== requiredLength ? {'hasLength': {requiredLength: requiredLength }} : null;
    }
}