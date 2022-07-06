import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterValidators } from '../validators/register-validators';
import { AuthService } from 'src/app/services/auth.service';
import { EmailTaken } from '../validators/email-taken';

import IUser from 'src/app/models/user.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
    constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

    inSubmission = false;

    name = new FormControl('', [Validators.required, Validators.minLength(4)]);
    email = new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
    );
    age = new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(100),
    ]);
    password = new FormControl('', [
        Validators.required,
        Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
        ),
    ]);
    confirm_password = new FormControl('', [Validators.required]);
    phoneNumber = new FormControl('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
    ]);

    showAlert = false;
    alertMessage = 'Please wait! Your account is being created.';
    alertColor = 'blue';

    registerForm = new FormGroup(
        {
            name: this.name,
            email: this.email,
            age: this.age,
            password: this.password,
            confirm_password: this.confirm_password,
            phoneNumber: this.phoneNumber,
        },
        [RegisterValidators.match('password', 'confirm_password')]
    );

    async register() {
        this.inSubmission = true;

        this.showAlert = true;
        this.alertMessage = 'Please wait! Your account is being created.';
        this.alertColor = 'blue';

        try {
            this.auth.createUser(this.registerForm.value as IUser);
        } catch (error) {
            console.log(error);

            this.alertMessage =
                'Ups! An unexcpected error ocurrer, please try again.';
            this.alertColor = 'red';
            this.inSubmission = false;
            return;
        }

        this.alertMessage = 'Succes! your account has been created';
        this.alertColor = 'green';
    }
}