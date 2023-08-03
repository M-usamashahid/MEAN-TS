import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedToPayComponent } from './proceed-to-pay.component';

describe('ProceedToPayComponent', () => {
  let component: ProceedToPayComponent;
  let fixture: ComponentFixture<ProceedToPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProceedToPayComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedToPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
