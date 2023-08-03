import { Component, OnInit, Input } from '@angular/core';
import { HttpService, HelperService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-studio-agreement',
  templateUrl: './studio-agreement.component.html',
  styleUrls: ['./studio-agreement.component.scss']
})
export class StudioAgreementComponent implements OnInit {

  @Input() questionnaire: any = {};

  data: any = {
    today: new Date(),
    name: '',
    phone: '',
    shippingAddress: {},
    total: {},
    products: {},
  }

  constructor(private helperService: HelperService, private httpService: HttpService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const client = this.helperService.getClient();
    this.data.name = `${client.firstName} ${client.lastName}`;
    this.data.email = client.email;
    this.getStudioAgreement(client.order.active);
  }

  getStudioAgreement(id: any): void {
    this.httpService.call(api.getStudioAgreement(id))
      .then(success => {

        console.log(success);

        this.data.phone = success.order.phone;
        this.data.shippingAddress = success.order.shippingAddress;
        this.data.total = success.order.total;
        this.data.products = success.products;

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

}
