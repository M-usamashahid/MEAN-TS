import { Component, OnInit } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';

import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {

  activeSection: string = 'access';
  paymentMethods: any = [];
  subscription: any = {
    subscription: {
      active: false,
    }
  };

  data: any = [];
  user: any = {
    currentPassword: '',
    changePassword: '',
    confirmPassword: '',
  };

  constructor(
    private httpService: HttpService,
    private helperService: HelperService,
    public dataService: DataService,
    private toastr: ToastrService,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
    let client = this.helperService.getClient();
    if (client && client.id) {
      this.data = client;
    }

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
          // this.ref.close({ isSuccess: true, resData});
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

  // changePassword(): void {
  //   const ref = this.dialogService.open(ClientChangePasswordComponent, {
  //     width: '50%',
  //     styleClass: '',
  //     showHeader: false,
  //     // data: {
  //     //   id: this.data.questionnaire
  //     // }
  //   });
  // }

}
