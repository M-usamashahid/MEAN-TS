import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesBookingMotivatorComponent } from './classes-booking-motivator.component';

describe('ClassesBookingMotivatorComponent', () => {
  let component: ClassesBookingMotivatorComponent;
  let fixture: ComponentFixture<ClassesBookingMotivatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassesBookingMotivatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesBookingMotivatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
