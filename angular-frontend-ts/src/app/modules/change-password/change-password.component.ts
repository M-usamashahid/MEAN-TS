import { Component, OnInit, } from '@angular/core';
import { HttpService, HelperService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { messages } from 'app/constants/messages.constants';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  user: any = {
    password: '',
    changePassword: '',
  };
  token: any = null;

  error: any = {
    password: '',
    changePassword: '',
  }
  constructor(
    private httpService: HttpService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams.token
    console.log(this.token)
  }

  savePassword(): void {
    console.log('save')
    if (this.token && this.user.password === this.user.changePassword && this.user.password !== '' && this.user.changePassword !== ''
    ) {
      this.httpService.call(api.resetPassword, {
        token: this.token,
        password: this.user.password,
      })
        .then(resData => {
          this.router.navigate(["home"]);

        }, error => {
          console.log(error.message);
          this.toastr.error(error.message);
        });
      this.user.password = ''
      this.user.changePassword = ''
    }
    else {
      this.toastr.error('Something went wrong');

    }
  }

}
