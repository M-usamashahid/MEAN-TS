import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';

import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { SharedModule } from 'app/modules/shared/shared.module';

import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { YourAccessComponent } from './your-access/your-access.component';
import { ChatComponent } from './chat/chat.component';
import { ManageComponent } from './manage/manage.component';
import { MyDetailsComponent } from './my-details/my-details.component';
import { MessageComponent } from './message/message.component';
import { CoachAppsTVstudioComponent } from 'app/modules/dashboard/coach-apps-tvstudio/coach-apps-tvstudio.component';

import { CancelSubscriptionDialogComponent } from './cancel-subscription-dialog/cancel-subscription-dialog.component';
import { ScheduleCallDialogComponent } from './schedule-call-dialog/schedule-call-dialog.component';
import { TvLiveComponent } from './tv-live/tv-live.component';
import { ClassBookingDialogComponent } from './class-booking-dialog/class-booking-dialog.component';
import { ClassesBookingMotivatorComponent } from './classes-booking-motivator/classes-booking-motivator.component';
import { ClassConfirmationDialogComponent } from './class-confirmation-dialog/class-confirmation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    PickerModule,
    FormsModule,
    TooltipModule,
    ProgressBarModule,
    HttpClientModule,
    SharedModule,
    DynamicDialogModule,
    LoadingBarHttpClientModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent, YourAccessComponent, ChatComponent, ManageComponent, MyDetailsComponent, MessageComponent, CancelSubscriptionDialogComponent, ScheduleCallDialogComponent, CoachAppsTVstudioComponent, TvLiveComponent, ClassBookingDialogComponent, ClassesBookingMotivatorComponent, ClassConfirmationDialogComponent],
  providers: [DialogService],
  entryComponents: [CancelSubscriptionDialogComponent, ScheduleCallDialogComponent, CoachAppsTVstudioComponent, ClassBookingDialogComponent, ClassConfirmationDialogComponent]
})
export class DashboardModule { }
