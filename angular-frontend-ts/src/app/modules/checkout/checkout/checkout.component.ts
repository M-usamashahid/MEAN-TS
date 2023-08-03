import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { api } from 'app/constants/api.constant';
import { countries } from 'app/constants/countries';
import { messages } from 'app/constants/messages.constants';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDismissDialogComponent } from 'app/modules/shared/components';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService]
})
export class CheckoutComponent implements OnInit, OnDestroy {

  order: any = {
    firstName: null,
    lastName: null,
    phone: null,
    stripePaymentMethodId: null,
    total: {},
    shippingAddress: {
      address1: null,
      city: null,
      state: null,
      country: null,
      countryCode: null,
      zip: null,
    },
    billingAddress: {
      address1: null,
      city: null,
      state: null,
      country: null,
      countryCode: null,
      zip: null,
    },
    shippingAddressSameAsBilling: true
  };
  paymentMethods: any = [];
  activePrice: any = {};

  countries: any = countries;
  state: any = [];

  getServiceData: any;
  paramsObject: any;
  error: any = {
    firstName: false,
    lastName: false,
    address: false,
    country: false,
    state: false,
    city: false,
    zip: false,
    phone: false
  }

  checkoutBtnDisabled: boolean = false;

  constructor(
    private httpService: HttpService,
    public helperService: HelperService,
    private dialogService: DialogService,
    public dataService: DataService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getPaymentMethods();

    let client = this.helperService.getClient();

    if (client.firstName) {
      this.order.firstName = client.firstName;
    }

    if (client.lastName) {
      this.order.lastName = client.lastName;
    }

    this.getServiceData = this.dataService.getData().subscribe(data => {
      if (data && data.data && (data.data.type === 'passdata' && data.data.key === 'payment-methods-update')) {
        this.getPaymentMethods();
      }
    });
    this.activatedRoute.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
      });
  }

  getProducts(): void {
    this.httpService.call(api.getProducts('recurring'))
      .then(success => {

        if (this.paramsObject.params.pkg == 1) {
          this.activePrice = success.price[1];
        } else if (this.paramsObject.params.pkg == 2) {
          this.activePrice = success.price[2];
        }
        else {
          this.activePrice = success.price[0];
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  getPaymentMethods(): void {
    this.httpService.call(api.paymentMethods)
      .then(success => {
        this.paymentMethods = success;
        if (this.paymentMethods.length) {
          this.selectPaymentMethod(this.paymentMethods[0].id)
        }
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  addPaymentMethod(): void {
    this.dataService.sendData(this.dataService.typeDialog('payment-method-dialog'));
  }

  selectPaymentMethod(id: any): void {
    this.order.stripePaymentMethodId = id;
  }

  onChangeShipping(value: any, type: any): void {

    if (type === 'country') {

      this.state = value.state;
      this.order.shippingAddress.countryCode = value.countryCode;
      this.order.shippingAddress.state = null;
      this.order.shippingAddress.stateCode = null;

      if (this.state.length > 0) {
        this.order.shippingAddress.state = this.state[0];
        this.order.shippingAddress.stateCode = this.order.shippingAddress.state.stateCode;
      }

    } else if (type === 'state') {
      this.order.shippingAddress.state = this.state.filter((s: any) => s.stateCode === value.stateCode)[0];
      this.order.shippingAddress.stateCode = this.order.shippingAddress.state.stateCode;
    }

  }

  onChangeBilling(value: any, type: any): void {

    if (type === 'country') {

      this.state = value.state;
      this.order.billingAddress.countryCode = value.countryCode;
      this.order.billingAddress.state = null;
      this.order.billingAddress.stateCode = null;

      if (this.state.length > 0) {
        this.order.billingAddress.state = this.state[0];
        this.order.billingAddress.stateCode = this.order.billingAddress.state.stateCode;
      }

    } else if (type === 'state') {
      this.order.billingAddress.state = this.state.filter((s: any) => s.stateCode === value.stateCode)[0];
      this.order.billingAddress.stateCode = this.order.billingAddress.state.stateCode;
    }

  }

  getTotal(): any {
    return this.activePrice.unitAmount / 100;
  }

  detachPaymentMethod(paymentMethod: any): void {

    const ref = this.dialogService.open(ConfirmDismissDialogComponent, {
      styleClass: 'confirm-dismiss-diloag',
      showHeader: false,
      data: {
        title: `Confirmation`,
        message: `Are you sure to delete this payment method?`,
        button: {
          success: { title: 'Confirm' },
          cancel: { title: 'Cancel' }
        }
      }
    });

    ref.onClose.subscribe(({ isSuccess }: any) => {
      if (isSuccess) {

        const data = {
          id: paymentMethod.id
        };

        this.httpService.call(api.detachPaymentMethod, data)
          .then(success => {
            this.order.stripePaymentMethodId = null;
            this.getPaymentMethods();
          }, error => {
            console.log(error);
            this.toastr.error(error.message);
          });
      }
    });

  }

  checkoutValidation(): boolean {
    let isValid = true;

    if (this.order.firstName === null || this.order.firstName === '') {
      this.error = {
        firstName: true
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.order.lastName === null || this.order.lastName === '') {
      this.error = {
        firstName: false,
        lastName: true
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.order.shippingAddress.address1 === null || this.order.shippingAddress.address1 === '') {
      this.error = {
        firstName: false,
        lastName: false,
        address: true
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.order.shippingAddress.country === null || this.order.shippingAddress.country === '') {
      this.error = {
        firstName: false,
        lastName: false,
        address: false,
        country: true
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.order.shippingAddress.state === null || this.order.shippingAddress.state === '') {
      this.error = {
        firstName: false,
        lastName: false,
        address: false,
        country: false,
        state: true,
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    }
    else if (this.order.shippingAddress.city === null || this.order.shippingAddress.city === '') {
      this.error = {
        firstName: false,
        lastName: false,
        address: false,
        country: false,
        state: false,
        city: true
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.order.shippingAddress.zip === null || this.order.shippingAddress.zip === '') {
      this.error = {
        firstName: false,
        lastName: false,
        address: false,
        country: false,
        state: false,
        city: false,
        zip: true,
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.order.phone === null || this.order.phone === '') {
      this.error = {
        firstName: false,
        lastName: false,
        address: false,
        country: false,
        state: false,
        city: false,
        zip: false,
        phone: true
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    } else if (this.order.stripePaymentMethodId === null) {
      this.error = {
        firstName: false,
        lastName: false,
        address: false,
        country: false,
        state: false,
        city: false,
        zip: false,
        phone: false
      }
      this.toastr.error('Add Payment Method');
      isValid = false;
    }

    return isValid;
  }

  completeCheckout(): void {

    if (this.checkoutValidation()) {

      this.checkoutBtnDisabled = true;

      const order: any = this.helperService.deepCopy(this.order);

      order.shippingAddress.countryCode = order.shippingAddress.country.countryCode;
      order.shippingAddress.country = order.shippingAddress.country.name;

      if (order.shippingAddress && order.shippingAddress.state && order.shippingAddress.state.name) {
        order.shippingAddress.stateCode = order.shippingAddress.state.stateCode;
        order.shippingAddress.state = order.shippingAddress.state.name;
      }

      if (order.shippingAddressSameAsBilling === false) {

        order.billingAddress.countryCode = order.billingAddress.country.countryCode;
        order.billingAddress.country = order.billingAddress.country.name;

        if (order.billingAddress && order.billingAddress.state && order.billingAddress.state.name) {
          order.billingAddress.stateCode = order.billingAddress.state.stateCode;
          order.billingAddress.state = order.billingAddress.state.name;
        }

      }

      const data = {
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        shippingAddressSameAsBilling: order.shippingAddressSameAsBilling,
        stripePaymentMethodId: order.stripePaymentMethodId,
        items: [this.activePrice],
        total: {
          amount: this.getTotal(),
          afterDiscount: this.getTotal(),
          discountedAmount: 0,
          afterTax: this.getTotal(),
          taxAmount: 0,
          appliedTaxrates: [],
          taxBreakdown: [],
        }
      };

      this.httpService.call(api.createSubscription, data)
        .then(async success => {
          this.checkoutBtnDisabled = false;

          await this.helperService.deleteClientCookie();
          await this.helperService.setClientCookie(success.jwt);

          this.dataService.sendData(this.dataService.typePassData('token-update', success));
          this.router.navigate(['questionnaire']);
        }, error => {
          console.log(error);
          this.toastr.error(error.message);
        });
    }
  }

  ngOnDestroy() {
    if (this.getServiceData) {
      this.getServiceData.unsubscribe();
    }
  }

}
