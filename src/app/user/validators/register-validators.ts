import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
    static match(controlName: string, matchinControlName: string): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchinControlName);

            if (!control || !matchingControl) {
                console.log('Form controls cant be found i the form group');

                return { controlNotFound: false };
            }
            const error =
                control.value === matchingControl.value
                    ? null
                    : { noMatch: true };

            matchingControl.setErrors(error);
            return error;
        };
    }
}
