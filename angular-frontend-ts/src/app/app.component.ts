import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'app/services';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {

    this.router.events.subscribe((evt: any) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    if (window && window.performance) {
      const stripe = document.createElement('script');
      stripe.async = true;
      stripe.setAttribute('src', `//js.stripe.com/v3/`);
      document.getElementsByTagName('head')[0].appendChild(stripe);
    }
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this.dataService.sendClickEvent(event.target);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.dataService.sendKeyPressEvent(event);
  }

}
