import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyNowComponent } from './buy-now/buy-now.component';

const routes: Routes = [
  {
    path: '',
    component: BuyNowComponent,
    data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyNowRoutingModule { }
