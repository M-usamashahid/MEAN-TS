import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioAgreementComponent } from './studio-agreement.component';

describe('StudioAgreementComponent', () => {
  let component: StudioAgreementComponent;
  let fixture: ComponentFixture<StudioAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudioAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
