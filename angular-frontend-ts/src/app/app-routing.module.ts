import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientGuard, ManageGuard } from 'app/services';

import { UserLayoutComponent } from 'app/layouts';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';

import { titles } from 'app/constants/title.constant';

// import { StudioLandingComponent } from './modules/studio-landing/studio-landing.component';
// import { HomeComponent } from 'app/modules/home/home.component';
import { AuthComponent } from './modules/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'buy-now',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
    data: {
      id: 'changePassword',
      title: titles.changePassword.valueOf()
    }
  },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      // {
      //   path: 'studio',
      //   component: StudioLandingComponent
      // },
      {
        path: 'buy-now',
        loadChildren: () =>
          import('app/modules/buy-now/buy-now.module').then(
            m => m.BuyNowModule
          )
      },
      {
        path: 'proceed-to-pay',
        loadChildren: () =>
          import('app/modules/proceed-to-pay/proceed-to-pay.module').then(
            m => m.ProceedToPayModule
          )
      },
      {
        path: 'thank-you',
        loadChildren: () =>
          import('app/modules/thank-you/thank-you.module').then(
            m => m.ThankYouModule
          )
      },
      {
        path: 'dashboard',
        canActivate: [ClientGuard],
        loadChildren: () =>
          import('app/modules/dashboard/dashboard.module').then(
            m => m.DashboardModule
          )
      },
      {
        path: 'questionnaire',
        canActivate: [ClientGuard],
        loadChildren: () =>
          import('app/modules/questionnaire/questionnaire.module').then(
            m => m.QuestionnaireModule
          )
      },
      // {
      //   path: 'checkout',
      //   canActivate: [ClientGuard],
      //   loadChildren: () =>
      //     import('app/modules/checkout/checkout.module').then(
      //       m => m.CheckoutModule
      //     )
      // },
      // {
      //   path: 'book-a-call',
      //   canActivate: [ManageGuard],
      //   loadChildren: () =>
      //     import('app/modules/booking/booking.module').then(
      //       m => m.BookingModule
      //     )
      // },
      // {
      //   path: 'profile',
      //   canActivate: [ClientGuard],
      //   loadChildren: () =>
      //     import('app/modules/client-profile/client-profile.module').then(
      //       m => m.ClientProfileModule
      //     )
      // },
    ]
  },
  {
    path: '**',
    redirectTo: 'buy-now'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
