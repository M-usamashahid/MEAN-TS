import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireOptionCardComponent } from './questionnaire-option-card.component';

describe('QuestionnaireOptionCardComponent', () => {
  let component: QuestionnaireOptionCardComponent;
  let fixture: ComponentFixture<QuestionnaireOptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireOptionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireOptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
