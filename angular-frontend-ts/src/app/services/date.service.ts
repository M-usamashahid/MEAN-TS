import { Injectable } from '@angular/core';
import { config } from '../constants';
import * as moment from 'moment';

/**
 * DateService: Gloable date managment & formatting
 */
@Injectable()
export class DateService {

  offset: any = config.defaultTimeZone;

  dateFormatMMMDDYYYY(date: any): any {
    return moment(date).format('MMM DD, YYYY');
  }

  dateFormatDDMMMM(date: any): any {
    return moment(date).format('DD MMMM');
  }

  dateFormatMMMDDYYYYHHmm(date: any): any {
    return moment(date).format('MMM DD, YYYY HH:mm');
  }

  fromNow(data: any): any {
    return data.fromNow();
  }

  dateFormat(format: any, date?: any): any {
    if (date) {
      return moment(date).format(format);
    }
    return moment().format(format);
  }

  moment(): any {
    return moment();
  }

  timeInEST(): any {
    const time = new Date();
    time.setMinutes(time.getUTCMinutes() + time.getTimezoneOffset());
    time.setMinutes(time.getUTCMinutes() + (this.offset * 60));
    return time.getTime();
  }

  todayDateUtcOffset(): any {
    return moment().utcOffset(this.offset);
  }

  convertDate(date: any): any {
    return moment(date);
  }

  constructTime(time: any): any {
    return moment(`${time.year}-${time.month}-${time.day} ${time.hour}:${time.min} +1200`).utc().local();
  }

}
