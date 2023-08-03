import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';

import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';

import { ConfirmDismissDialogComponent } from 'app/modules/shared/components';
import { CancelSubscriptionDialogComponent } from '../cancel-subscription-dialog/cancel-subscription-dialog.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  tab: any = {
    management: true,
    subscription: false,
  }
  productTabVisible: boolean = false;
  subscriptionTabVisible: boolean = false;

  getServiceData: any;

  paymentMethods: any = [];
  orders: any = {
    allOrders: [],
    subscriptions: [],
    liveSubscriptions: [],
  };

  constructor(private httpService: HttpService,
    public helperService: HelperService,
    public dataService: DataService,
    private toastr: ToastrService,
    public dialogService: DialogService) { }

  ngOnInit(): void {
    this.getMyOrders();

    // this.getSubscription();
    // this.getPaymentMethods();
    // this.getServiceData = this.dataService.getData().subscribe(data => {
    //   if (data && data.data && (data.data.type === 'passdata' && data.data.key === 'payment-methods-update')) {
    //     this.getPaymentMethods();
    //   }
    // });
  }

  getMyOrders(): void {
    this.httpService.call(api.getMyOrders)
      .then(success => {

        this.orders = success;

        if (this.orders.product.length) {
          this.productTabVisible = true;
        } else {
          this.tab = {
            management: false,
            subscription: true,
          }
        }

        if (this.orders.subscriptions.length || this.orders.liveSubscriptions.length) {
          this.subscriptionTabVisible = true;
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  trackOrder(order: any): void {

    this.httpService.call(api.getOrderTraking(order._id))
      .then(success => {

        // trackingId & trackingURL 

        if (success.trackingURL) {

          this.helperService.openURLInNewTab(success.trackingURL);

        } else {
          this.toastr.info('Tracking details not available yet!');
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });

  }

  cancelSubscription(item: any, order: any): void {

    const date1: any = new Date(order.createdAt);
    const today: any = new Date();
    const diffTime = Math.abs(today - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (item.status === 'active') {

      const ref = this.dialogService.open(CancelSubscriptionDialogComponent, {
        styleClass: 'confirm-dismiss-diloag',
        showHeader: false,
        data: {
          type: item.type,
          daysOfSubscription: diffDays
        }
      });

      ref.onClose.subscribe(({ isSuccess, reason }: any) => {
        if (isSuccess) {

          this.httpService.call(api.cancelSubscription, { ...item, reason })
            .then(success => {
              this.getMyOrders();
            }, error => {
              console.log(error);
              this.toastr.error(error.message);
            });
        }
      });
    }
  }

  switchTab(tab: any): void {
    this.tab = tab;
  }

  getPaymentMethods(): void {
    this.httpService.call(api.paymentMethods)
      .then(success => {
        this.paymentMethods = success;
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  addPaymentMethod(): void {
    this.dataService.sendData(this.dataService.typeDialog('payment-method-dialog'));
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
            this.getPaymentMethods();
          }, error => {
            console.log(error);
            this.toastr.error(error.message);
          });
      }
    });

  }

  getSubscription(): void {
    this.httpService.call(api.getSubscription)
      .then(success => {
        this.orders = success;

        if (this.orders.order.items.length) {
          this.orders.order.items.forEach((item: any) => {
            if (item.type === 'subscription') {
              this.subscriptionTabVisible = true;
            }
          });
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  ngOnDestroy() {
    if (this.getServiceData) {
      this.getServiceData.unsubscribe();
    }
  }

}
