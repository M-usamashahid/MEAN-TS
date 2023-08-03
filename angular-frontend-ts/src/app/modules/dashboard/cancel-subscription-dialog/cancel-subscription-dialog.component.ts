import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cancel-subscription-dialog',
  templateUrl: './cancel-subscription-dialog.component.html',
  styleUrls: ['./cancel-subscription-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CancelSubscriptionDialogComponent implements OnInit {

  client: any = {};
  over90Days: boolean = false;

  type: any = null;
  daysOfSubscription: any = 0;

  progress: number = 0;

  cancelationProcess: boolean = false;

  reason: any = null;

  constructor(public ref: DynamicDialogRef,
    public dConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    private helperService: HelperService,
    private toastr: ToastrService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.client = this.helperService.getClient();

    const data = this.dConfig.data;

    this.daysOfSubscription = data.daysOfSubscription;
    this.type = data.type;

    console.log('--------------------------');
    console.log(this.type);

    if (this.daysOfSubscription >= 90) {

      this.over90Days = true;
    } else {
      this.progress = Math.floor(this.daysOfSubscription / 90 * 100)
    }

  }

  processToCancellation(): void {
    this.cancelationProcess = true;
  }

  requestCancelation(): void {

    if(this.reason){
      this.ref.close({ isSuccess: true, reason: this.reason });
    } else {
      this.toastr.error('Please provide a reason.');
    }
  }

  closeDialog(): void {
    this.ref.close({ isSuccess: false });
  }

}
