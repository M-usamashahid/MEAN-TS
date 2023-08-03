import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
import { SharedModule } from 'app/modules/shared/shared.module';

import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { PixelModule } from 'ngx-pixel';

import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CarouselModule } from 'primeng/carousel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import {
  HelperService,
  HttpService,
  DataService,
  SocketService,
  DateService,
  ClientGuard,
  ManageGuard
} from 'app/services';

import { UserLayoutComponent } from 'app/layouts';
import { HeaderWrapperComponent, NavBarComponent, SideMenuLogoComponent } from 'app/layouts/components';
import { AuthDialogComponent, PaymentMethodDialogComponent, ClientChangePasswordComponent } from 'app/modules/components';

import { ChangePasswordComponent } from 'app/modules/change-password/change-password.component';
import { environment } from '../environments/environment';
// import { HomeComponent } from './modules/home/home.component';
// import { StudioLandingComponent } from './modules/studio-landing/studio-landing.component';
import { AuthComponent } from './modules/auth/auth.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    SocialLoginModule,
    DynamicDialogModule,
    DropdownModule,
    OverlayPanelModule,
    PanelModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    HttpClientModule,
    CarouselModule,
    PixelModule.forRoot({
      enabled: true,
      pixelId: '324368098537719'
    }),
    ToastrModule.forRoot(
      {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }),
  ],
  declarations: [
    AppComponent,
    UserLayoutComponent,
    HeaderWrapperComponent,
    NavBarComponent,
    PaymentMethodDialogComponent,
    AuthDialogComponent,
    ChangePasswordComponent,
    ClientChangePasswordComponent,
    SideMenuLogoComponent,
    // HomeComponent,
    // StudioLandingComponent,
    AuthComponent
  ],
  providers: [
    HelperService,
    CookieService,
    DataService,
    DateService,
    HttpService,
    DialogService,
    SocketService,
    ClientGuard,
    ManageGuard,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.google),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebook),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  entryComponents: [AuthDialogComponent, PaymentMethodDialogComponent, ClientChangePasswordComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
