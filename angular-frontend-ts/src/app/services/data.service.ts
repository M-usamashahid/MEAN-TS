import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * DataService: Reactive data service for pass data and open dialogs on root level
 */
@Injectable()
export class DataService {

  private subject = new Subject<any>();
  private clickEventSubject = new Subject<any>();
  private keyPressEventSubject = new Subject<any>();

  sendClickEvent = (data: any) => this.clickEventSubject.next(data);
  getClickEvent = (): Observable<any> => this.clickEventSubject.asObservable();

  sendKeyPressEvent = (data: any) => this.keyPressEventSubject.next(data);
  getKeyPressEvent = (): Observable<any> => this.keyPressEventSubject.asObservable();

  sendData = (data: any) => this.subject.next({ data });
  clearData = () => this.subject.next();
  getData = (): Observable<any> => this.subject.asObservable();

  /*
   * @param {string} tab Which tab needs to update
   * @param {string} from from where this dialog is opening
   * @param {object} data Required data if any
   */

  typeDialog(dialog: string, data: any = null, from: any = null): any {
    return { type: 'dialog', dialog, data, from };
  }

  // * Data for type sidebar (sidebar open)
  // * @param  {string} tab Which tab needs to update
  // * @param  {string} key name of the data key
  // * @param  {object} data Required data

  typePassData(key: any, data: any): any {
    return { type: 'passdata', key, data };
  }

}
