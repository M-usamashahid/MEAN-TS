import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { SharedModule } from 'app/modules/shared/shared.module';

import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';

import { BookingRoutingModule } from './booking-routing.module';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { CallCardComponent } from './components/call-card/call-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TooltipModule,
    HttpClientModule,
    SharedModule,
    DynamicDialogModule,
    LoadingBarHttpClientModule,
    BookingRoutingModule
  ],
  declarations: [OnboardingComponent, CallCardComponent],
  providers: [DialogService],
  entryComponents: []
})
export class BookingModule { }
