import { Component, OnInit } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any = [];
  yourAccess: boolean = false;
  eztonedLive: boolean = false;

  constructor(private httpService: HttpService,
    public helperService: HelperService,
    public dataService: DataService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    let client = this.helperService.getClient();
    if (client && client.id) {
      this.data = client;
      this.getMyOrders();
    }
  }

  getMyOrders(): void {
    this.httpService.call(api.getMyOrders)
      .then(success => {
        if (success.subscriptions.length) {
          this.yourAccess = true;
        }
        if (success.liveSubscriptions.length) {
          this.yourAccess = true;
          this.eztonedLive = true;
        }
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

}
