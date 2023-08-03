import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBookingDialogComponent } from './class-booking-dialog.component';

describe('ClassBookingDialogComponent', () => {
  let component: ClassBookingDialogComponent;
  let fixture: ComponentFixture<ClassBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassBookingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
