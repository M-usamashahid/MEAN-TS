import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-questionnaire-option-card',
  templateUrl: './questionnaire-option-card.component.html',
  styleUrls: ['./questionnaire-option-card.component.scss']
})
export class QuestionnaireOptionCardComponent implements OnInit {

  @Input() title: string = '';
  @Input() active: boolean = false;

  @Output() onSelect = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  select(value: any): void {
    this.onSelect.emit(value);
  }

}
