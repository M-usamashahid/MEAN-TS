import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCardComponent } from './call-card.component';

describe('CallCardComponent', () => {
  let component: CallCardComponent;
  let fixture: ComponentFixture<CallCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
