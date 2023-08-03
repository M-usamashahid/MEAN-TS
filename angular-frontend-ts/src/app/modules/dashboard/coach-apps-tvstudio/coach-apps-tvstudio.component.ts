import { Component, OnInit } from '@angular/core';
import { HttpService, HelperService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-coach-apps-tvstudio',
  templateUrl: './coach-apps-tvstudio.component.html',
  styleUrls: ['./coach-apps-tvstudio.component.scss']
})
export class CoachAppsTVstudioComponent implements OnInit {

  state: any = 'tv';

  constructor(public ref: DynamicDialogRef,
    public dConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    private toastr: ToastrService,
    private httpService: HttpService,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    const data = this.dConfig.data;
    if (data && data.isCoach) {
      this.state = 'coach';
    }
  }

  checkState(state: any): any {
    let isSameState = false;

    if (state === this.state) {
      isSameState = true;
    }

    return isSameState;
  }

  watchTv(): void {

    this.httpService.call(api.clientWatchTv)
      .then(success => {
        this.closeDialog();
        this.helperService.openURLInNewTab(success.url)
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  getEverFit(ios = false): void {
    if (ios) {
      this.helperService.openURLInNewTab('https://apps.apple.com/us/app/everfit-train-smart/id1438926364?ls=1');
    } else {
      this.helperService.openURLInNewTab('https://play.google.com/store/apps/details?id=com.everfit');
    }

    this.closeDialog();
  }

  closeDialog(): void {
    this.ref.close({ isSuccess: false });
  }
}
