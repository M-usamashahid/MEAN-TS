import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService, DateService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-class-booking-dialog',
  templateUrl: './class-booking-dialog.component.html',
  styleUrls: ['./class-booking-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClassBookingDialogComponent implements OnInit {

  title: any = null;
  type: any = null;
  schedule: any = null;
  slots: any = [];

  selectedDay: any = 'monday';
  selectedDate: any = null;
  selectedSlot: any = null;
  slotBooked: boolean = false;

  isBookingSuccess: boolean = false;

  constructor(public ref: DynamicDialogRef,
    public dConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    private helperService: HelperService,
    private dateService: DateService,
    private toastr: ToastrService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {

    const data = this.dConfig.data;

    this.title = data.title;
    this.type = data.type;
    this.schedule = data.schedule;
    this.selectedDate = this.getDate(1).raw;
    this.slots = this.schedule['monday'];
  }

  getDate(dayINeed: any): any {

    let today = this.dateService.moment().isoWeekday();
    let formatedDate = null;

    if (today <= dayINeed) {
      formatedDate = this.dateService.moment().isoWeekday(dayINeed);
    } else {
      formatedDate = this.dateService.moment().isoWeekday(dayINeed + 7);
    }

    return {
      date: formatedDate.format('DD'), month: formatedDate.format('MMM'), raw: formatedDate
    }
  }

  selectDate(day: any, date: any): void {
    this.selectedDay = day;
    this.selectedDate = date.raw;
    this.slots = this.schedule[day];
    this.selectedSlot = null;
  }

  selectSlot(slot: any): void {
    this.selectedSlot = slot;
  }

  converTime(slot: any): any {
    const date = this.dateService.constructTime({
      year: this.selectedDate.format('YYYY'),
      month: this.selectedDate.format('MMM'),
      day: this.selectedDate.format('DD'),
      hour: slot.start.hour,
      min: '00',
    });

    return date.format('hh:mm A');
  }

  conformationDateFormat(date: any): any {
    return `${this.selectedDay} ${this.dateService.dateFormatDDMMMM(date)}`;
  }

  closeDialog(): void {
    this.ref.close({ isSuccess: this.isBookingSuccess });
  }


  reSelectBooking(): void {
    this.selectedSlot = null;
  }

  bookAClass(): void {

    const data = {
      schedule: this.selectedSlot._id,
      slot: this.selectedSlot,
      booking: {
        title: `${this.converTime(this.selectedSlot)}, ${this.selectedDate.format('DD')} ${this.selectedDate.format('MMMM')}`,
        year: this.selectedDate.format('YYYY'),
        month: this.selectedDate.format('M'),
        day: this.selectedDate.format('DD'),
        weekDay: this.selectedDay,
        hour: this.selectedSlot.start.hour,
        min: this.selectedSlot.start.min,
        timezone: this.selectedSlot.start.timezone,
      }
    }

    this.httpService.call(api.bookClass, data)
      .then(success => {
        this.slotBooked = true;
        this.isBookingSuccess = true;
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });

  }

  closeAfterBooking(): void {
    this.ref.close({ isSuccess: true });
  }

}
