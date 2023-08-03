import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { api } from 'app/constants/api.constant';
import { countries } from 'app/constants/countries';
import { messages } from 'app/constants/messages.constants';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDismissDialogComponent } from 'app/modules/shared/components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService]
})
export class BuyNowComponent implements OnInit, OnDestroy {

  initialLoadingDone: boolean = false;
  activeProduct: any = {
    title: 'EzToned Ezbar',
    type: 'product',
    product: {},
    paymentMethods: [],
    country: {},
    unitAmount: 0,
    weeklyClasses: 0,
    isSubscription: false,
    billingType: 'monthly',
    stripePriceId: null,
  }

  stripe: any;

  order: any = {
    firstName: null,
    lastName: null,
    email: null,
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
  userCountryCode: any = null;
  countries: any = countries;
  state: any = [];

  paymentMethods: any = [];
  activePrice: any = {
    unitAmount: 299 * 100,
    currency: 'usd'
  };

  getServiceData: any;
  paramsObject: any;
  error: any = {
    firstName: false,
    lastName: false,
    email: false,
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

    console.log(environment.thankyou_url);
    // let client = this.helperService.getClient();

    // if (client && client.firstName) {
    //   this.order.firstName = client.firstName;
    // }

    // if (client && client.lastName) {
    //   this.order.lastName = client.lastName;
    // }

    // if (client && client.email) {
    //   this.order.email = client.email;
    // }

    this.getProductsForCheckOut();

    this.activatedRoute.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
      });

  }

  getProductsForCheckOut(): void {

    this.httpService.call(api.getIPRegistry)
      .then(payload => {

        // Get IP Country
        if (payload && payload.location && payload.location.country && payload.location.country.code) {
          let filterCountry = this.countries.filter((country: any) => country.countryCode.toLowerCase() === payload.location.country.code.toLowerCase());
          if (filterCountry.length) {
            this.order.shippingAddress.country = filterCountry[0];
          }
        }

        this.httpService.call(api.getProductsForCheckOut)
          .then(source => {

            if (this.paramsObject.params.product) {

              const product = this.paramsObject.params.product;

              console.log(source);

              if (product === 'product_ezbar') {
                this.activeProduct.product = source.products.product_ezbar;
                this.activeProduct.paymentMethods = source.products.paymentMethods;
              } else if (product === 'subscription_monthly') {
                this.activeProduct.product = source.subscription.subscription_monthly;
                this.activeProduct.paymentMethods = source.subscription.paymentMethods;
                this.activeProduct.isSubscription = true;
                this.activeProduct.billingType = 'monthly';
                this.activeProduct.title = 'EzToned Subscription';
                this.activeProduct.type = 'subscription';
              } else if (product === 'subscription_quarterly') {
                this.activeProduct.product = source.subscription.subscription_quarterly;
                this.activeProduct.paymentMethods = source.subscription.paymentMethods;
                this.activeProduct.isSubscription = true;
                this.activeProduct.billingType = 'quarterly';
                this.activeProduct.title = 'EzToned Subscription';
                this.activeProduct.type = 'subscription';
              } else if (product === 'subscription_yearly') {
                this.activeProduct.product = source.subscription.subscription_yearly;
                this.activeProduct.paymentMethods = source.subscription.paymentMethods;
                this.activeProduct.isSubscription = true;
                this.activeProduct.billingType = 'yearly';
                this.activeProduct.title = 'EzToned Subscription';
                this.activeProduct.type = 'subscription';
              } else if (product === 'weekly_live_three') {
                this.activeProduct.product = source.subscription.live_class_three;
                this.activeProduct.paymentMethods = source.subscription.paymentMethods;
                this.activeProduct.isSubscription = true;
                this.activeProduct.billingType = 'weekly';
                this.activeProduct.title = 'EzToned Live';
                this.activeProduct.type = 'subscription-live';
                this.activeProduct.weeklyClasses = 3;
              } else if (product === 'weekly_live_five') {
                this.activeProduct.product = source.subscription.live_class_five;
                this.activeProduct.paymentMethods = source.subscription.paymentMethods;
                this.activeProduct.isSubscription = true;
                this.activeProduct.billingType = 'weekly';
                this.activeProduct.title = 'EzToned Live';
                this.activeProduct.type = 'subscription-live';
                this.activeProduct.weeklyClasses = 5;
              } else if (product === 'weekly_live_seven') {
                this.activeProduct.product = source.subscription.live_class_seven;
                this.activeProduct.paymentMethods = source.subscription.paymentMethods;
                this.activeProduct.isSubscription = true;
                this.activeProduct.billingType = 'weekly';
                this.activeProduct.title = 'EzToned Live';
                this.activeProduct.type = 'subscription-live';
                this.activeProduct.weeklyClasses = 7;
              }
              else {
                this.activeProduct.product = source.products.product_ezbar;
                this.activeProduct.paymentMethods = source.products.paymentMethods;
              }

            } else {
              this.activeProduct.product = source.products.product_ezbar;
              this.activeProduct.paymentMethods = source.products.paymentMethods;
            }

            this.setPrice();

            this.initialLoadingDone = true;

          }, error => {
            console.log(error);
            this.toastr.error(error.message);
          });

      });

  }

  setPrice(): void {
    let filterCountry = this.activeProduct.paymentMethods.filter((country: any) => country.countryCode.toLowerCase() === this.order.shippingAddress.country.countryCode.toLowerCase());
    this.activeProduct.country = filterCountry[0];
    this.activeProduct.currency = this.activeProduct.country.currency;
    if (this.activeProduct.isSubscription) {
      this.activeProduct.unitAmount = this.activeProduct.product[this.activeProduct.currency].amount;
      this.activeProduct.stripePriceId = this.activeProduct.product[this.activeProduct.currency].stripeId;
    } else {
      this.activeProduct.unitAmount = this.activeProduct.product[this.activeProduct.currency];
    }
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

      this.setPrice();

      // Price Change by Country
      // if (this.order.shippingAddress.countryCode === 'GB') {
      //   this.activePrice = {
      //     unitAmount: 129 * 100,
      //     currency: 'gbp'
      //   };
      // }

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
    return Math.round(this.activeProduct.unitAmount) / 100;
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
    }
    else if (this.order.email === null || this.order.email === '') {
      this.error = {
        firstName: false,
        lastName: false,
        email: true
      }
      this.toastr.error(messages.fieldsMissing);
      isValid = false;
    }
    else if (this.order.shippingAddress.address1 === null || this.order.shippingAddress.address1 === '') {
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
    }

    // else if (this.order.stripePaymentMethodId === null) {
    //   this.error = {
    //     firstName: false,
    //     lastName: false,
    //     address: false,
    //     country: false,
    //     state: false,
    //     city: false,
    //     zip: false,
    //     phone: false
    //   }
    //   this.toastr.error('Add Payment Method');
    //   isValid = false;
    // }

    return isValid;
  }

  completeCheckout(): void {

    if (this.checkoutValidation()) {

      this.checkoutBtnDisabled = true;

      const order: any = this.helperService.deepCopy(this.order);
      const activeProduct: any = this.helperService.deepCopy(this.activeProduct);
      delete activeProduct.paymentMethods;

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
        email: order.email,
        phone: order.phone,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        shippingAddressSameAsBilling: order.shippingAddressSameAsBilling,
        stripeAccount: activeProduct.currency === 'nzd' ? 'nz' : 'uk',
        allowedPaymentMethods: activeProduct.country.paymentMethods,
        items: [{
          ...activeProduct,
          status: 'unpaid',
        }],
        total: {
          amount: this.getTotal(),
          afterDiscount: this.getTotal(),
          discountedAmount: 0,
          afterTax: this.getTotal(),
          taxAmount: 0,
          appliedTaxrates: [],
          taxBreakdown: [],
          currency: activeProduct.currency.toLowerCase(),
        }
      };

      console.log(data);

      this.httpService.call(api.createPlaceOrder, data)
        .then(order => {

          console.log(`Order created successfully`);

          this.router.navigate(['proceed-to-pay'], { queryParams: { order_id: order._id } });

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
