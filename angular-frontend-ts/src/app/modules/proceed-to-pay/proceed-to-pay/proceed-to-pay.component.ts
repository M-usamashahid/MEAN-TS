import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { api } from 'app/constants/api.constant';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { environment } from '../../../../environments/environment';

declare var Stripe: any;

@Component({
  selector: 'app-proceed-to-pay',
  templateUrl: './proceed-to-pay.component.html',
  styleUrls: ['./proceed-to-pay.component.scss']
})
export class ProceedToPayComponent implements OnInit {

  paramsObject: any;

  order: any = {};
  item: any = {};

  paymentmethods: any = ['card'];

  selectedPaymentMethod: any = null;
  clientSecret: any = null;

  showCardWrapper: boolean = false;
  showFinalBtn: boolean = false;
  finalBtnDiasblend: boolean = false;

  @ViewChild('cardDivElement') cardDivElement: any;
  cardHandler = this.onCardChange.bind(this);
  stripe: any;
  elements: any;
  cardElement: any;

  constructor(
    private httpService: HttpService,
    public helperService: HelperService,
    private loadingBar: LoadingBarService,
    private dialogService: DialogService,
    public dataService: DataService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params, };
        if (this.paramsObject.params.order_id) {
          this.getOrderDetails(this.paramsObject.params.order_id);
        }
      });
  }

  getOrderDetails(orderid: any): void {
    this.httpService.call(api.getOrderPaymentmethods(orderid))
      .then(success => {
        this.order = success;
        this.item = success.items[0];
        if (this.order.allowedPaymentMethods.length === 1) {
          this.selectPaymentMethod(this.order.allowedPaymentMethods[0]);
        }
        console.log(this.order);
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  onCardChange(data: any): void {
    if (data && data.error) {
      this.toastr.error(data.error.message);
    }
    this.cd.detectChanges();
  }

  selectPaymentMethod(method: any) {
    this.selectedPaymentMethod = method;
    this.getPaymentIntent();
    this.showFinalBtn = true;
  }

  getPaymentIntent() {
    this.httpService.call(api.getPaymentIntent, {
      orderid: this.paramsObject.params.order_id,
      method: this.selectedPaymentMethod,
    })
      .then(success => {

        this.clientSecret = success.client_secret;

        this.stripe = Stripe(success.aKey);

        this.showCardWrapper = true;
        this.elements = this.stripe.elements();
        const cardStyle = {
          base: {
            iconColor: '#FFFFFF',
            color: '#FFFFFF',
            fontFamily: '"Nunito", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#FFFFFF',
              iconColor: '#FFFFFF',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        };
        this.cardElement = this.elements.create('card', { style: cardStyle });
        this.cardElement.mount(this.cardDivElement.nativeElement);
        this.cardElement.addEventListener('change', this.cardHandler);

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  async payNow() {

    // Subscription
    if (this.order.items[0].type === 'subscription' || this.order.items[0].type === 'subscription-live') {

      // If Payment Method is Card
      if (this.selectedPaymentMethod === 'card') {
        this.loadingBar.start();
        this.finalBtnDiasblend = true;

        // Save Client Card
        const { setupIntent, error } = await this.stripe.confirmCardSetup(
          this.clientSecret,
          {
            payment_method: {
              card: this.cardElement
            },
          }
        );

        if (error) {
          // Display error.message in your UI.
          console.error(error);
          console.error(error.code, error.message);
          this.toastr.error((error && error.message) ? error.message : 'Error');

        } else if (setupIntent.status === 'succeeded') {

          this.httpService.call(api.createConfirmSubscription, {
            orderId: this.paramsObject.params.order_id,
            paymentMethod: setupIntent.payment_method,
          })
            .then(success => {

              console.log(success);

              this.loadingBar.complete();

              this.router.navigate(['thank-you'], { queryParams: { order_id: this.order._id } });
            }, error => {
              console.log(error);
              this.toastr.error(error.message);
            });
        }
      }

      // One Time Payment
    } else {

      // If Payment Method is Card
      if (this.selectedPaymentMethod === 'card') {
        this.loadingBar.start();
        this.finalBtnDiasblend = true;

        const { error: stripeError, paymentIntent } = await this.stripe.confirmCardPayment(
          this.clientSecret,
          {
            payment_method: {
              card: this.cardElement
            }
          }
        );

        if (stripeError) {
          console.log(stripeError);
          this.toastr.error(stripeError.message);
          return;
        }

        this.loadingBar.complete();
        console.log(paymentIntent.id);

        this.router.navigate(['thank-you'], { queryParams: { order_id: this.order._id, intent_id: paymentIntent.id } });

      } else if (this.selectedPaymentMethod === 'afterpay_clearpay') {

        this.loadingBar.start();
        this.finalBtnDiasblend = true;

        let { error: stripeError, paymentIntent } = await this.stripe.confirmAfterpayClearpayPayment(
          this.clientSecret,
          {
            payment_method: {
              billing_details: {
                name: `${this.order.client.firstName} ${this.order.client.lastName}`,
                email: this.order.client.email,
                address: {
                  line1: this.order.shippingAddress.address1,
                  line2: this.order.shippingAddress.address1,
                  city: this.order.shippingAddress.city,
                  state: this.order.shippingAddress.state,
                  postal_code: this.order.shippingAddress.zip,
                  country: this.order.shippingAddress.countryCode,
                }
              },
            },
            shipping: {
              name: `${this.order.client.firstName} ${this.order.client.lastName}`,
              address: {
                line1: this.order.shippingAddress.address1,
                line2: this.order.shippingAddress.address1,
                city: this.order.shippingAddress.city,
                state: this.order.shippingAddress.state,
                postal_code: this.order.shippingAddress.zip,
                country: this.order.shippingAddress.countryCode,
              }
            },
            return_url: `${environment.thankyou_url}/thank-you?order_id=${this.order._id}`
          }
        );

        if (stripeError) {
          console.log(stripeError);
          this.toastr.error(stripeError.message);
          return;
        }

        console.log(paymentIntent);

      }

    }

  }

}
