import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };
  showAlert = false;
  alertColor = 'red';
  alertMessage = '';
  buttonDisable = false;

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async login() {
    try {
      this.buttonDisable = true;
      this.showAlert = true;
      this.alertColor = 'blue';
      this.alertMessage = 'Please wait! we are loggin you';

      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      this.alertMessage =
        'Ups! An unexcpected error ocurrer, please try again.';
      this.alertColor = 'red';
      this.buttonDisable = false;
      return;
    }
    this.alertColor = 'green';
    this.alertMessage = 'Success! you are now logged in';
    this.buttonDisable = false;
  }
}
