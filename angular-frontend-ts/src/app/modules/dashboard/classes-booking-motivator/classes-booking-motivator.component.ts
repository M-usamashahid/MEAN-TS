import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-classes-booking-motivator',
  templateUrl: './classes-booking-motivator.component.html',
  styleUrls: ['./classes-booking-motivator.component.scss']
})
export class ClassesBookingMotivatorComponent implements OnInit {

  @Input() weeklyClasses: number = 0;
  @Input() boockedClasses: number = 0;

  // keepItGoing
  // nearlyThere
  // fullyBooked
  // fullyBookedFinal

  constructor() { }

  ngOnInit(): void {
  }

  getState(): any {
    let state = null;

    if (this.weeklyClasses === 7 && (this.boockedClasses === 1 || this.boockedClasses === 2 || this.boockedClasses === 3 || this.boockedClasses === 4)) {
      state = 'keepItGoing';
    } else if (this.weeklyClasses === 7 && (this.boockedClasses === 5 || this.boockedClasses === 6)) {
      state = 'nearlyThere';
    } else if (this.weeklyClasses === 7 && this.boockedClasses === 7) {
      state = 'fullyBookedFinal';
    } else if (this.weeklyClasses === 5 && (this.boockedClasses === 1 || this.boockedClasses === 2)) {
      state = 'keepItGoing';
    } else if (this.weeklyClasses === 5 && (this.boockedClasses === 3 || this.boockedClasses === 4)) {
      state = 'nearlyThere';
    } else if (this.weeklyClasses === 5 && this.boockedClasses === 5) {
      state = 'fullyBooked';
    } else if (this.weeklyClasses === 3 && this.boockedClasses === 1) {
      state = 'keepItGoing';
    } else if (this.weeklyClasses === 3 && this.boockedClasses === 2) {
      state = 'nearlyThere';
    } else if (this.weeklyClasses === 3 && this.boockedClasses === 3) {
      state = 'fullyBooked';
    }

    return state;
  }

}
