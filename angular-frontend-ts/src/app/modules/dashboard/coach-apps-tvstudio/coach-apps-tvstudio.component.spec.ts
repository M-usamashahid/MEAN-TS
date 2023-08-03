import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAppsTVstudioComponent } from './coach-apps-tvstudio.component';

describe('CoachAppsTVstudioComponent', () => {
  let component: CoachAppsTVstudioComponent;
  let fixture: ComponentFixture<CoachAppsTVstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachAppsTVstudioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAppsTVstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
