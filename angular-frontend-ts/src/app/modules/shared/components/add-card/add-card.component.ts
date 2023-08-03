import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';
import { messages } from 'app/constants/messages.constants';

declare var Stripe: any;

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCardComponent implements OnInit {

  isLoading: any = true;
  saveDisabled = true;
  cardAddInpregress = false;

  config: any = {};
  stripe: any;
  elements: any;
  card: any;
  @ViewChild('cardInfo') cardInfo: any;
  cardHandler = this.onChange.bind(this);
  cardError: any;

  @Output() onSaveCard = new EventEmitter<any>();

  constructor(
    private httpService: HttpService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.setupIntent(), 100);
  }

  onChange(data: any): void {
    if (data && data.error) {
      this.cardError = data.error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
    if (data.complete) {
      this.saveDisabled = false;
    }
  }

  setupIntent(): void {

    this.httpService.call(api.createSetupIntent)
      .then(success => {
        this.config = success;

        if (this.config.aKey) {
          this.stripe = Stripe(this.config.aKey);
          this.elements = this.stripe.elements();

          // Giving a base style here, but most of the style is in scss file
          const cardStyle = {
            base: {
              iconColor: '#FFFFFF',
              color: '#FFFFFF',
              fontFamily: '"Nunito", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#FFFFFF',
                iconColor: '#FFFFFF',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          };
          this.card = this.elements.create('card', { style: cardStyle });
          this.card.mount(this.cardInfo.nativeElement);
          this.card.addEventListener('change', this.cardHandler);
          this.isLoading = false;

        } else {
          this.toastr.error(messages.configMissing);
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });

  }

  async paymentMethodSave(): Promise<any> {
    this.saveDisabled = true;
    this.cardAddInpregress = true;

    const { setupIntent, error } = await this.stripe.confirmCardSetup(
      this.config.bKey,
      {
        payment_method: {
          card: this.card
        },
      }
    );

    if (error) {
      // Display error.message in your UI.
      console.error(error);
      console.error(error.code, error.message);
      this.cardError = (error && error.message) ? error.message : 'Error';
      this.cardAddInpregress = false;
      this.saveDisabled = false;
    } else {
      if (setupIntent.status === 'succeeded') {
        // The setup has succeeded. Display a success message. Send
        // setupIntent.payment_method to your server to save the card to a Customer
        // console.log(setupIntent);

        this.config = {};
        this.cardAddInpregress = false;
        this.onSaveCard.emit(true);
        this.setupIntent();
        // this.ref.close({ isSuccess: true });

        // this.httpService.call(api.stripeCustomerUpdate(setupIntent.payment_method))
        //   .then(success => {

        //   }, error2 => {
        //     console.log(error2);
        //     this.toastr.error(error2.error);
        //   });

      }
    }
  }



}
