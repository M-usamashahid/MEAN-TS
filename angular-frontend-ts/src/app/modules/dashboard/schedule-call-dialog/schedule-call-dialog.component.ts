import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-schedule-call-dialog',
  templateUrl: './schedule-call-dialog.component.html',
  styleUrls: ['./schedule-call-dialog.component.scss']
})
export class ScheduleCallDialogComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef,
    private httpService: HttpService,
    private helperService: HelperService,
    public dataService: DataService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    let client = this.helperService.getClient();
    this.helperService.calendlyBook('eztoned', `${client.firstName} ${client.lastName}`, client.email);
  }

  closeDialog(): void {
    this.ref.close({ isSuccess: false });
  }

}
