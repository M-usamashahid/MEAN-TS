import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogService } from 'primeng/dynamicdialog';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import {
    ScreenBodyComponent,
    LoadingBarComponent,
    ScreenWrapperComponent,
    ScreenHeaderComponent,
    PaymentCardComponent,
    ConfirmDismissDialogComponent,
    AddCardComponent
} from 'app/modules/shared/components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoadingBarHttpClientModule
    ],
    declarations: [
        ScreenBodyComponent,
        LoadingBarComponent,
        ScreenWrapperComponent,
        ScreenHeaderComponent,
        PaymentCardComponent,
        ConfirmDismissDialogComponent,
        AddCardComponent,
    ],
    exports: [
        ScreenBodyComponent,
        LoadingBarComponent,
        ScreenWrapperComponent,
        ScreenHeaderComponent,
        PaymentCardComponent,
        ConfirmDismissDialogComponent,
        AddCardComponent
    ],
    providers: [
        DialogService
    ],
    entryComponents: [
        ConfirmDismissDialogComponent,
    ]
})

export class SharedModule { }