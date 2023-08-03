import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Api } from 'app/interfaces/api.interface';
import { HelperService } from './helper.service';

/**
 * HttpService: All XHR requests
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private headers: any;
  private token: any;

  /*
* @param  {HttpClient} HttpClient Http Client
* @param  {CookieService} CookieService Cookie Service
* @param  {HelperService} HelperService Helper Service
*/
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private helperService: HelperService) { }

  getHeaders(): any {

    if (this.cookieService.check('eztclitok')) {
      this.token = this.cookieService.get('eztclitok');
    } else if (this.cookieService.check('coubtok')) {
      this.token = this.cookieService.get('coubtok');
    }

    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('jwt', (this.token) ? this.token : '');
    return this.headers;
  }

  getFileHeaders(): any {

    if (this.cookieService.check('eztclitok')) {
      this.token = this.cookieService.get('eztclitok');
    } else if (this.cookieService.check('coubtok')) {
      this.token = this.cookieService.get('coubtok');
    }

    this.headers = new HttpHeaders()
      .set('jwt', (this.token) ? this.token : '');
    return this.headers;
  }


  async call(api: Api, data?: any, file?: any) {
    let headers;

    if (file) {
      headers = await this.getFileHeaders();
    } else {
      headers = await this.getHeaders();
    }

    if (data) {
      // @ts-ignore:
      return this.http
      [api.method]
        (api.url, data, { headers })
        .toPromise()
        .then(this.successHandler.bind(this))
        .catch(this.errorHandler.bind(this));
    } else {

      // @ts-ignore:
      return this.http
      [api.method]
        (api.url, { headers })
        .toPromise()
        .then(this.successHandler.bind(this))
        .catch(this.errorHandler.bind(this));
    }
  }

  downloadFile(url: string): any {
    return this.http.get(url, { responseType: 'blob' }).toPromise();
  }

  /*
* ==============================
*         Helper Methods
* ==============================
*  */

  successHandler(res: any): any {
    return Promise.resolve(res);
  }

  errorHandler(res: any): any {
    console.log('---- Error Handler ----');
    if (res.error.errors.length === 1) {
      return Promise.reject(res.error.errors[0]);
    } else {
      return Promise.reject(res.error.errors);
    }
  }
}
