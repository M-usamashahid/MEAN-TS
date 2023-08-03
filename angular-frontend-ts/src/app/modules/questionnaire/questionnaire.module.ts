import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { SharedModule } from 'app/modules/shared/shared.module';

import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';

import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { QuestionnaireOptionCardComponent } from './components/questionnaire-option-card/questionnaire-option-card.component';
import { StudioAgreementComponent } from './studio-agreement/studio-agreement.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TooltipModule,
    HttpClientModule,
    CheckboxModule,
    SharedModule,
    DynamicDialogModule,
    PaginatorModule,
    LoadingBarHttpClientModule,
    QuestionnaireRoutingModule
  ],
  declarations: [QuestionnaireComponent, QuestionnaireOptionCardComponent, StudioAgreementComponent],
  providers: [DialogService],
  entryComponents: []
})
export class QuestionnaireModule { }
