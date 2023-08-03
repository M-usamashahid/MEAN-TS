import { Component, OnInit } from '@angular/core';
import { HttpService, HelperService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-client-change-password',
  templateUrl: './client-change-password.component.html',
  styleUrls: ['./client-change-password.component.scss']
})
export class ClientChangePasswordComponent implements OnInit {

  data: any = null;
  user: any = {
    currentPassword: '',
    changePassword: '',
    confirmPassword: '',
  };


  constructor(public ref: DynamicDialogRef,
    public dConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    private httpService: HttpService,
    private helperService: HelperService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  savePassword(): void {
    if (this.user.currentPassword !== this.user.changePassword &&
      this.user.changePassword === this.user.confirmPassword
      && this.user.changePassword !== '' && this.user.confirmPassword !== '' && this.user.currentPassword !== ''

    ) {
      console.log("passwordChange", this.user.changePassword)
      this.httpService.call(api.changePassword, {
        password: this.user.currentPassword,
        newPassword: this.user.changePassword,
      })
        .then(resData => {
          this.ref.close({ isSuccess: true, resData});
        }, error => {
          console.log(error.message);
          this.toastr.error(error.message);
        });
      this.user.currentPassword = ''
      this.user.changePassword = ''
      this.user.confirmPassword = ''
    } else {
      this.toastr.error('Something went wrong');
    }

  }

  closeDialog(): void {
    this.ref.close({ isSuccess: false });
  }
}



