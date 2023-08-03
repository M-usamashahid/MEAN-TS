import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';

import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';

import { ClassBookingDialogComponent } from '../class-booking-dialog/class-booking-dialog.component';
import { ClassConfirmationDialogComponent } from '../class-confirmation-dialog/class-confirmation-dialog.component';

@Component({
  selector: 'app-tv-live',
  templateUrl: './tv-live.component.html',
  styleUrls: ['./tv-live.component.scss']
})
export class TvLiveComponent implements OnInit {

  myCoins: any = 500;
  weeklyClasses: any = 0;
  boockedClasses: any = 0;
  boockedSlots: any = [];
  schedule: any = [];

  constructor(private httpService: HttpService,
    public helperService: HelperService,
    public dataService: DataService,
    private toastr: ToastrService,
    public dialogService: DialogService) { }

  ngOnInit(): void {
    this.getMyClasses();
  }

  getMyClasses(): void {
    this.httpService.call(api.getMyClasses)
      .then(success => {
        this.myCoins = success.coin;
        if (success.order && success.order.items.length) {
          this.weeklyClasses = success.order.items[0].weeklyClasses;
        }
        if (success.schedule && success.schedule.length) {
          this.schedule = success.schedule;
        }
        if (success.bookings && success.bookings.length) {
          this.boockedSlots = success.bookings;
          this.boockedClasses = this.boockedSlots.length;
        } else {
          this.boockedSlots = [];
          this.boockedClasses = 0;
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  bookAClass(type: any, title: any): void {

    let filtredSchedule = this.helperService.deepCopy(this.schedule).filter((s: any) => s.type === type);

    const ref = this.dialogService.open(ClassBookingDialogComponent, {
      styleClass: 'confirm-dismiss-diloag',
      showHeader: false,
      data: {
        type,
        title,
        schedule: this.helperService.groupBy(filtredSchedule, 'day')
      }
    });

    ref.onClose.subscribe(({ isSuccess }: any) => {
      if (isSuccess) {
        this.getMyClasses();
      }
    });

  }

  classesBookingMotivator(): any {

  }

  JoinClass(slot: any): void {

    const ref = this.dialogService.open(ClassConfirmationDialogComponent, {
      styleClass: 'confirm-dismiss-diloag',
      showHeader: false,
      data: {
        state: 'joinclass',
        title: 'It\'s TIME TO gET YOUR SWEAT ON!',
        slot
      }
    });

    ref.onClose.subscribe(({ isSuccess }: any) => {
      if (isSuccess) {

      }
    });

  }

  cancelClass(slot: any): void {

    const ref = this.dialogService.open(ClassConfirmationDialogComponent, {
      styleClass: 'confirm-dismiss-diloag',
      showHeader: false,
      data: {
        state: 'cancelclass',
        title: 'CANCEL YOUR BOOKING',
        slot
      }
    });

    ref.onClose.subscribe(({ isSuccess, state }: any) => {
      if (isSuccess && state === 'cancelclass') {

        this.httpService.call(api.updateBookClass(slot._id), {
          isDeleted: true
        })
          .then(success => {

            console.log(success);
            this.getMyClasses();
          }, error => {
            console.log(error);
            this.toastr.error(error.message);
          });

      }
    });

  }

}
