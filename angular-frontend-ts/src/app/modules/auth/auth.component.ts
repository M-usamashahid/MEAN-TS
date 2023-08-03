import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { Router } from '@angular/router';
import { api } from 'app/constants/api.constant';
import { messages } from 'app/constants/messages.constants';
import { countries } from 'app/constants/countries';
import { ToastrService } from 'ngx-toastr';

import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {

  social: any;
  forgotEmailSec: boolean = false;
  activeLogin = false;
  activeSignup = true;
  countries: any = countries;
  isPasswordSet: any = 'na'; //na, yes, no
  state: any = 'login'; // login, signup
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    forgotEmail: '',
    country: null,
    stripeAccount: 'uk',
  };

  error: any = null;

  constructor(
    private httpService: HttpService,
    private helperService: HelperService,
    private toastr: ToastrService,
    private dataService: DataService,
    private router: Router,
    private authService: SocialAuthService) { }

  ngOnInit(): void {
    this.httpService.call(api.getIPRegistry)
      .then(payload => {

        if (payload && payload.location && payload.location.country && payload.location.country.code) {
          let filterCountry = this.countries.filter((country: any) => country.countryCode.toLowerCase() === payload.location.country.code.toLowerCase());
          if (filterCountry.length) {
            this.user.country = filterCountry[0];
            if (this.user.country.countryCode.toLowerCase() === 'nz') {
              this.user.stripeAccount = 'nz';
            }
          }
        }
      })

    this.social = this.authService.authState.subscribe((user) => this.socialLogin(user));
  }

  loginValidation(): boolean {
    let isValid = true;

    if (this.user.email === null || this.user.email === '') {
      this.error = messages.fieldsMissing;
      isValid = false;
    } else if (this.user.password === null || this.user.password === '') {
      this.error = messages.fieldsMissing;
      isValid = false;
    }

    return isValid;
  }

  forgotEmailValidation(): boolean {
    let isValid = true;

    if (this.user.forgotEmail === null || this.user.forgotEmail === '') {
      this.error = messages.fieldsMissing;
      isValid = false;
    }
    return isValid;
  }

  signUpValidation(): boolean {
    let isValid = true;

    if (this.user.firstName === null || this.user.firstName === '') {
      this.error = messages.fieldsMissing;
      isValid = false;
    } else if (this.user.lastName === null || this.user.lastName === '') {
      this.error = messages.fieldsMissing;
      isValid = false;
    } else if (this.user.email === null || this.user.email === '') {
      this.error = messages.fieldsMissing;
      isValid = false;
    } else if (this.user.password === null || this.user.password === '') {
      this.error = messages.fieldsMissing;
      isValid = false;
    }

    return isValid;
  }

  login(): void {

    if (this.isPasswordSet === 'na') {
      if (this.user.email && this.user.email !== '') {
        this.httpService.call(api.clientIsPasswordSet, {
          email: this.user.email.toLowerCase(),
        })
          .then(resData => {

            console.log(resData);

            if (resData.password) {
              this.isPasswordSet = 'yes';
            } else {
              this.isPasswordSet = 'no';
            }

          }, error => {
            console.log(error.message);
            this.error = error.message;
            // this.toastr.error(error.message);
          });
      } else {
        this.error = messages.fieldsMissing;
        // this.toastr.error(messages.fieldsMissing);
      }
    } else {

      if (this.loginValidation()) {

        this.httpService.call(api.clientLogin, {
          email: this.user.email.toLowerCase(),
          password: this.user.password,
          isPasswordSet: (this.isPasswordSet === 'no') ? false : true,
        })
          .then(resData => {
            this.error = null;
            // this.ref.close({ isSuccess: true, resData });
            this.afterLogin(resData.jwt);
          }, error => {
            console.log(error.message);
            this.toastr.error(error.message);
            this.error = 'EzToned ID not found. Try again, or create one now';
          });
      }

    }

  }

  logInClick(): void {
    this.activeLogin = true;
    this.activeSignup = false;
    this.state = 'login'
  }

  onCountryChange(value: any): void {
    if (value.countryCode.toLowerCase() === 'nz') {
      this.user.stripeAccount = 'nz';
    } else {
      this.user.stripeAccount = 'uk';
    }
  }

  signUp(): void {

    if (this.signUpValidation()) {
      if (this.helperService.validateEmail(this.user.email)) {

        this.httpService.call(api.clientSignUp, {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email.toLowerCase(),
          password: this.user.password,
          stripeAccount: this.user.stripeAccount,
        })
          .then(resData => {
            this.error = null;
            // this.ref.close({ isSuccess: true, resData });
            this.afterLogin(resData.jwt);
          }, error => {
            console.log(error);
            this.toastr.error(error.message);
          });

      } else {
        this.error = null;
        this.toastr.error(messages.invalidEmail);
      }

    }
  }

  signUpClick(): void {
    this.activeSignup = true
    this.activeLogin = false
    this.state = 'signup'
  }

  socialLoginpopUp(isGoogle: boolean = false): void {
    this.authService.signIn((isGoogle) ? GoogleLoginProvider.PROVIDER_ID : FacebookLoginProvider.PROVIDER_ID);
  }

  socialLogin(data: any): void {
    const sData = {
      id: data.id,
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      photoUrl: data.photoUrl,
      authToken: data.authToken,
      provider: data.provider,
      stripeAccount: this.user.stripeAccount,
    };

    this.httpService.call(api.socialLogin, sData)
      .then(resData => {
        // this.ref.close({ isSuccess: true, resData });

        this.afterLogin(resData.jwt);

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  checkState(state: any): any {
    let isSameState = false;

    if (state === this.state) {
      isSameState = true;
    }

    return isSameState;
  }

  forgot(): void {
    this.forgotEmailSec = true
  }

  forgotEmailSent(): void {
    if (this.forgotEmailValidation()) {

      this.httpService.call(api.clientForgot, {
        email: this.user.forgotEmail.toLowerCase(),
      })
        .then(resData => {
          console.log('test', resData)
          this.afterLogin(resData.jwt);
          // this.ref.close({ isSuccess: true, resData, state: this.state });
        }, error => {
          console.log(error.message);
          this.toastr.error(error.message);
        });
    }
    this.forgotEmailSec = false
  }

  async afterLogin(jwt: any) {

    await this.helperService.setClientCookie(jwt);

    let client = this.helperService.getClient();

    if (client && client.id) {
      this.dataService.sendData(this.dataService.typePassData('token-update', true));
    }

    this.router.navigate(['/dashboard/manage']);

  }

  ngOnDestroy(): void {
    if (this.social) {
      this.social.unsubscribe();
    }
  }

}
