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

import { ThankYouRoutingModule } from './thank-you-routing.module';
import { ThankYouComponent } from './thank-you/thank-you.component';

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
    ThankYouRoutingModule
  ],
  declarations: [
    ThankYouComponent
  ],
  providers: [DialogService],
  entryComponents: []
})
export class ThankYouModule { }
