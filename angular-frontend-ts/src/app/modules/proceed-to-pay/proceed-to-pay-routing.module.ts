import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProceedToPayComponent } from './proceed-to-pay/proceed-to-pay.component';

const routes: Routes = [
  {
    path: '',
    component: ProceedToPayComponent,
    data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProceedToPayRoutingModule { }
