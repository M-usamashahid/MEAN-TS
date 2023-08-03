import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu-logo',
  templateUrl: './side-menu-logo.component.html',
  styleUrls: ['./side-menu-logo.component.scss']
})
export class SideMenuLogoComponent implements OnInit {

  constructor(
    private router: Router) { }

  ngOnInit(): void {
  }
  
  goTo(url: string): void {
    this.router.navigate([url]);
  }

}
