import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService, DateService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-class-confirmation-dialog',
  templateUrl: './class-confirmation-dialog.component.html',
  styleUrls: ['./class-confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClassConfirmationDialogComponent implements OnInit {

  title: any = null;
  state: any = null; // joinclass, cancelclass
  slot: any = {};

  constructor(public ref: DynamicDialogRef,
    public dConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    private helperService: HelperService,
    private dateService: DateService,
    private toastr: ToastrService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {

    const data = this.dConfig.data;

    this.title = data.title;
    this.state = data.state;
    this.slot = data.slot;
  }

  closeDialog(): void {
    this.ref.close({ isSuccess: false, state: this.state });
  }

  launchClass(): void {
    this.helperService.openURLInNewTab(this.slot.schedule.zoom.link);
  }

  cancelClass(): void {
    this.ref.close({ isSuccess: true, state: this.state });
  }

}
