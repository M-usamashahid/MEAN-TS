import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
// Services
import { HelperService } from './helper.service';

/**
 * AuthGuard: Allow Logged In User Only
 */
@Injectable()
export class ClientGuard implements CanActivate {  /*
   * @param  {Router} router Angular Router
   * @param  {HelperService} helperService Helper Service
   */
  constructor(private router: Router, private helperService: HelperService) { }
  /*
   * @returns {Boolean} Boolean True when user logged in
   */
  canActivate(): boolean {
    const token = this.helperService.getClient();
    if (token && token.email) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
