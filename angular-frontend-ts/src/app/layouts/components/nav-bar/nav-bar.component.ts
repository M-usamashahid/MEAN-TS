import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from "app/constants/api.constant";
import { SocialAuthService } from 'angularx-social-login';
import { AuthDialogComponent, PaymentMethodDialogComponent } from 'app/modules/components';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class NavBarComponent implements OnInit, OnDestroy {
  client: any = {};
  isLoggedIn: any = false;
  getServiceData: any;
  isShown: boolean = false;
  isHome: boolean = false;

  constructor(
    private dialogService: DialogService,
    private helperService: HelperService,
    private httpService: HttpService,
    private router: Router,
    private dataService: DataService,
    private authService: SocialAuthService,
  ) {
  }

  ngOnInit(): void {
    let client = this.helperService.getClient();
    if (client && client.id) {
      this.client = client;
      this.isLoggedIn = true;
    }

    if (this.router.url === '/home') {
      this.isHome = true;
    } else {
      this.isHome = false;
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/home') {
          this.isHome = true;
        } else {
          this.isHome = false;
        }
      }
    });

    this.getServiceData = this.dataService.getData().subscribe(obj => {

      const data = obj.data;

      if (data.type === 'dialog' && data.dialog === 'auth-dialog') {
        this.userAuth(true, (data.data) ? data.data : null);
      } else if (data.type === 'dialog' && data.dialog === 'payment-method-dialog') {
        this.paymentMethodDialog();
      }

      if (data.type === 'passdata' && data.key === 'token-update') {
        client = this.helperService.getClient();
        if (client && client.id) {
          this.client = client;
          this.isLoggedIn = true;
        }
      }

    });
  }

  goTo(url: string): void {
    this.router.navigate([url]);
  }

  userAuth(isSignUp = false, pkg: any = 0): void {
    const ref = this.dialogService.open(AuthDialogComponent, {
      styleClass: 'auth-dialog',
      showHeader: false,
      dismissableMask: true,
      data: {
        isSignUp,
        pkg
      }
    });

    ref.onClose.subscribe(async (data) => {
      if (data && data.isSuccess) {

        await this.helperService.setClientCookie(data.resData.jwt);

        this.isLoggedIn = true;
        this.client = this.helperService.getClient();

        if (this.client && this.client.id) {
          this.dataService.sendData(this.dataService.typePassData('token-update', true));
        }

        setTimeout(() => {

          // if (this.client && this.client.order.active === null) {
          //   // this.router.navigate(['checkout'])
          //   this.router.navigate(['checkout'], { queryParams: { pkg: data.pkg } });

          // } else if (this.client && this.client.order.active && this.client.questionnaire.filled === false) {
          //   this.router.navigate(['questionnaire']);
          // } else if (this.client && this.client.order.active && this.client.questionnaire.filled) {
          //   this.router.navigate(['dashboard/manage']);
          // }

          // if (this.client && this.client.questionnaire.filled === false) {
          //   this.router.navigate(['questionnaire']);
          // } else if (this.client && this.client.questionnaire.filled && this.client.order.active === null) {
          //   this.router.navigate(['checkout']);
          // } else if (this.client && this.client.order.active && this.client.questionnaire.filled && this.client.onboarding.callBooked === false) {
          //   this.router.navigate(['book-a-call']);
          // }
        }, 100)

      }
    });
  }

  paymentMethodDialog(): void {
    const ref = this.dialogService.open(PaymentMethodDialogComponent, {
      styleClass: 'payment-method-dialog',
      showHeader: false,
      dismissableMask: true,
    });

    ref.onClose.subscribe((data) => {
      if (data && data.isSuccess) {
        this.dataService.sendData(this.dataService.typePassData('payment-methods-update', true));
      }
    });
  }

  logOut(): void {
    this.httpService.call(api.clientLogout).then(
      async (success) => {
        this.getServiceData.unsubscribe();
        await this.helperService.deleteClientCookie();
        this.authService.signOut();
        this.isLoggedIn = false;
        this.isShown = false;
        this.router.navigate(["auth"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.getServiceData.unsubscribe();
  }

}
