import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { messages } from 'app/constants/messages.constants';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService]
})
export class QuestionnaireComponent implements OnInit {

  isLoading = true;
  enableOtherGoal = false;
  agreement = false;
  questionnaire: any = {};
  activeQuestion: number = 11;

  experienceLevel: any = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10'
  ];

  weeklyExercise: any = [
    '0 - I currently don\'t exercise',
    '1 Day / Week',
    '2 Day / Week',
    '3 Day / Week',
    '4 Day / Week',
    '5 Day / Week',
    '6 Day / Week',
    '7 Day / Week'
  ];

  habits: any = [
    'I eat a lot of junk food',
    'I mainly eat healthy',
    'Bit of both - junk food and healthy food',
    'I have no clue',
  ];

  constructor(
    private httpService: HttpService,
    private helperService: HelperService,
    public dataService: DataService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getQuestionnaire();
  }

  getQuestionnaire(): void {
    this.httpService.call(api.getQuestionnaire)
      .then(success => {
        this.isLoading = false;
        this.questionnaire = success.questionnaire;
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  next(): any {

    if (this.activeQuestion === 1 && (this.questionnaire.goal === null || this.questionnaire.goal === '')) {
      return this.toastr.error(messages.fieldsMissing);
    }
    if (this.activeQuestion === 2 && (this.questionnaire.age === null || this.questionnaire.age === '')) {
      return this.toastr.error(messages.fieldsMissing);
    }
    if (this.activeQuestion === 3 && (this.questionnaire.gender === null || this.questionnaire.gender === '')) {
      return this.toastr.error(messages.fieldsMissing);
    }

    if (this.activeQuestion < 11) {
      this.activeQuestion += 1;
    }
  }

  back(): void {
    if (this.activeQuestion > 1) {
      this.activeQuestion -= 1;
    }
  }

  activeStep(question: any): void {
    if (question <= this.activeQuestion) {
      this.activeQuestion = question;
    }
  }


  genderSelect(value: any): void {
    this.questionnaire.gender = value;
  }

  weightSwtich(value: any): void {
    this.questionnaire.weightUnit = value;
  }

  heightSwtich(value: any): void {
    this.questionnaire.heightUnit = value;
  }

  goalSelect(value: any): void {
    if (value !== "Other") {
      this.questionnaire.goal = value;
      this.enableOtherGoal = false;
    } else {
      this.questionnaire.goal = null;
      this.enableOtherGoal = true;
    }
  }

  submit(): void {

    // if (this.questionnaire.goal === null || this.questionnaire.goal === '') {
    //   this.toastr.error(messages.fieldsMissing);
    // } else if (this.questionnaire.age === null || this.questionnaire.age === '') {
    //   this.toastr.error(messages.fieldsMissing);
    // } else if (this.questionnaire.gender === null || this.questionnaire.gender === '') {
    //   this.toastr.error(messages.fieldsMissing);
    // } else {

      this.questionnaire.filled = false;

      this.httpService.call(api.updateQuestionnaire, {
        questionnaire: this.questionnaire
      })
        .then(async success => {

          await this.helperService.deleteClientCookie();
          await this.helperService.setClientCookie(success.jwt);

          this.dataService.sendData(this.dataService.typePassData('token-update', success));

          this.router.navigate(['dashboard/manage']);
        }, error => {
          console.log(error);
          this.toastr.error(error.message);
        });
    }

  // }

}
