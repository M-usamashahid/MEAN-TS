import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';
import { messages } from 'app/constants/messages.constants';

import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit, OnDestroy {

  paramsObject: any;
  social: any;
  orderId: any = null;
  user: any = {
    email: null,
    password: null,
    isPasswordSet: false
  }

  constructor(
    private httpService: HttpService,
    public helperService: HelperService,
    public dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: SocialAuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params, };
        if (this.paramsObject.params.order_id) {
          this.orderId = this.paramsObject.params.order_id;
          this.confirmOrder(this.orderId);
        }
      });

    this.social = this.authService.authState.subscribe((user) => this.socialLogin(user));
  }

  loginValidation(): boolean {
    let isValid = true;
    if (this.user.email === null || this.user.email === '') {
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.user.password === null || this.user.password === '') {
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    }

    return isValid;
  }

  confirmOrder(orderId: any): void {
    this.httpService.call(api.createConfirmOrder, { orderId })
      .then(success => {

        this.user.email = success.email;
        this.user.isPasswordSet = success.isPasswordSet;

        // console.log('----------------------');
        // console.log(this.user);

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  socialLoginpopUp(isGoogle: boolean = false): void {
    this.authService.signIn((isGoogle) ? GoogleLoginProvider.PROVIDER_ID : FacebookLoginProvider.PROVIDER_ID);
  }

  socialLogin(data: any): any {

    if (data.email.toLowerCase() !== this.user.email.toLowerCase()) {
      this.toastr.error('Email address should be same');
    } else {

      const sData = {
        id: data.id,
        name: data.name,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        photoUrl: data.photoUrl,
        authToken: data.authToken,
        provider: data.provider
      };

      this.httpService.call(api.socialLogin, sData)
        .then(async data => {

          await this.helperService.setClientCookie(data.jwt);
          const client = this.helperService.getClient();

          if (client && client.id) {
            this.dataService.sendData(this.dataService.typePassData('token-update', true));
          }

          this.router.navigate(['dashboard/manage']);

        }, error => {
          console.log(error.message);
          this.toastr.error(error.message);
        });
    }

  }

  continue(): void {

    if (this.loginValidation()) {

      this.httpService.call(api.clientLogin, {
        email: this.user.email.toLowerCase(),
        password: this.user.password,
        isPasswordSet: this.user.isPasswordSet,
      })
        .then(async data => {

          await this.helperService.setClientCookie(data.jwt);
          const client = this.helperService.getClient();

          if (client && client.id) {
            this.dataService.sendData(this.dataService.typePassData('token-update', true));
          }

          this.router.navigate(['dashboard/manage']);

        }, error => {
          console.log(error.message);
          this.toastr.error(error.message);
        });
    }

  }

  ngOnDestroy(): void {
    if (this.social) {
      this.social.unsubscribe();
    }
  }

}
