import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';

import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { SharedModule } from 'app/modules/shared/shared.module';

import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';

import { BuyNowRoutingModule } from './buy-now-routing.module';
import { BuyNowComponent } from './buy-now/buy-now.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    InputSwitchModule,
    TooltipModule,
    HttpClientModule,
    SharedModule,
    DynamicDialogModule,
    PaginatorModule,
    LoadingBarHttpClientModule,
    BuyNowRoutingModule
  ],
  declarations: [BuyNowComponent],
  providers: [DialogService],
  entryComponents: []
})
export class BuyNowModule { }
