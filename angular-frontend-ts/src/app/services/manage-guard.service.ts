import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
// Services
import { HelperService } from './helper.service';

/**
 * AuthGuard: Allow Logged In User Only
 */
@Injectable()
export class ManageGuard implements CanActivate {  /*
   * @param  {Router} router Angular Router
   * @param  {HelperService} helperService Helper Service
   */
  constructor(private router: Router, private helperService: HelperService) { }
  /*
   * @returns {Boolean} Boolean True when user logged in
   */
  canActivate(): boolean {
    const client = this.helperService.getClient();

    if (client && client.email) {

      if (client && client.order.active === null) {
        this.router.navigate(['checkout']);
        return false;
      }

      // else if (client && client.order.active && client.questionnaire.filled === false) {
      //   this.router.navigate(['questionnaire']);
      //   return false;
      // }

      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
