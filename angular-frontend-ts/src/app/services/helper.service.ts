import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { orderBy, groupBy } from "lodash";
import jwt_decode from "jwt-decode";
declare var Calendly: any;

/**
 * HelperService: All helper methods
 */
@Injectable()
export class HelperService {

  /*
  * @param  {CookieService} CookieService Cookie Service
  */
  constructor(private cookieService: CookieService) { }

  openPageInNewTab(path: string): void {
    const url = `${window.location.origin}/${path}`;
    const win = window.open(url, '_blank');
    if (!win) {
      window.location.replace(url);
    }
  }

  openURLInNewTab(url: string): void {
    const win = window.open(url, '_blank');
  }

  copyToClipboard(url: string): void {
    const copyhelper = document.createElement('input');
    copyhelper.className = 'copyhelper';
    document.body.appendChild(copyhelper);
    copyhelper.value = url;
    copyhelper.select();
    document.execCommand('copy');
    document.body.removeChild(copyhelper);
  }

  validateEmail(email: string): any {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  deepCopy(data: any): any {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  }

  orderBy(array: any, keys: any, order: any): any {
    orderBy(array, keys, order);
  }

  groupBy(array: any, keys: any): any {
    return groupBy(array, keys);
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  jwtDecode(token: any): any {
    return jwt_decode(token);
  }

  getClient(): any {
    const token = this.cookieService.get('eztclitok');
    if (token) {
      return this.deepCopy(this.jwtDecode(token));
    } else {
      return null;
    }
  }

  getClientToken(): any {
    const token = this.cookieService.get('eztclitok');
    if (token) {
      return token;
    } else {
      return null;
    }
  }

  validatFileType(files: any, extensions: any): any {
    let isAllowed = false;

    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].name.split('.');

      if (fileType.length > 1) {
        if (extensions.indexOf(`.${fileType[1].toLowerCase()}`) !== -1) {
          isAllowed = true;
        } else {
          isAllowed = false;
          break;
        }
      } else {
        if (extensions.indexOf(`.${fileType[0]}`) !== -1) {
          isAllowed = true;
        } else {
          isAllowed = false;
          break;
        }
      }
    }
    return isAllowed;
  }

  validatFileSize(files: any, maxSize: any): any {
    let isAllowed = false;

    for (let i = 0; i < files.length; i++) {

      const fileSize = files[i].size * 0.000001;

      if (fileSize <= maxSize) {
        isAllowed = true;
      } else {
        isAllowed = false;
        break;
      }
    }
    return isAllowed;
  }

  intervalCount(intervalCount: any): string {

    if (intervalCount == 12) {
      return 'Year'
    } else if (intervalCount == 3) {
      return '3 Months'
    } else {
      return 'Month'
    }
  }

  calendlyBook(calendlyUserName: string, clientName: string, clientEmail: string): void {
    Calendly.initInlineWidget({
      url: `https://calendly.com/${calendlyUserName}/30min?hide_gdpr_banner=1&background_color=171A1E&text_color=ffffff&primary_color=D33732`,
      parentElement: document.getElementById('calendly-onboarding-wrapper'),
      prefill: {
        name: clientName,
        email: clientEmail
      },
    });
  }

  async setClientCookie(jwt: any): Promise<void> {
    return new Promise((resolve, reject) => {
      let age = 1200 * 60 * 60 * 1000;
      this.cookieService.set("eztclitok", jwt, age, '/');
      resolve();
    });
  }

  async deleteClientCookie(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.cookieService.check("eztclitok")) {
        this.cookieService.delete("eztclitok", '/');
      }
      resolve();
    });
  }

}
