import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})
export class PaymentCardComponent implements OnInit {

  @Input() card: any = {};
  @Input() active: boolean = false;

  @Output() onDeleteCard = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteCardHandler(event: any): void {
    this.onDeleteCard.emit(this.card);
  }
}
