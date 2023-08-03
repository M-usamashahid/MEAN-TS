import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCallDialogComponent } from './schedule-call-dialog.component';

describe('ScheduleCallDialogComponent', () => {
  let component: ScheduleCallDialogComponent;
  let fixture: ComponentFixture<ScheduleCallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleCallDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
