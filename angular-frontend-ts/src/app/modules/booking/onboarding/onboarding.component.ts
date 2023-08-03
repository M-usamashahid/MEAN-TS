import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OnboardingComponent implements OnInit {

  heading: string = "Loading ...";
  calls: any = [];

  constructor(
    private httpService: HttpService,
    private helperService: HelperService,
    public dataService: DataService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.onboardingCallStatus();
  }

  onboardingCallStatus() {
    this.httpService.call(api.getOnboardingCallStatus)
      .then(success => {

        if (success.onboarding) {
          this.heading = "Thankyou, Your onboarding is completed!";
        } else if (success.onboarding === false && success.calls.length) {
          this.heading = "Book A Call";
          this.calls = success.calls;
          console.log(this.calls);
        } else {
          this.heading = "Book A Call";
          let client = this.helperService.getClient();
          this.helperService.calendlyBook('eztoned', `${client.firstName} ${client.lastName}`, client.email);
        }
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

}
