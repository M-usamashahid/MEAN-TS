import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-dismiss-dialog',
  templateUrl: './confirm-dismiss-dialog.component.html',
  styleUrls: ['./confirm-dismiss-dialog.component.scss']
})
export class ConfirmDismissDialogComponent implements OnInit {
  data: any = {};
  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef) { }

  ngOnInit(): void {
    this.data = this.dialogConfig.data;
  }

  closeDialog(isSuccess: any, btn = ''): void {
    this.data.btn = btn;
    this.dynamicDialogRef.close({ isSuccess, data: this.data });
  }

}
