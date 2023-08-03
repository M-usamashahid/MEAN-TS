import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioLandingComponent } from './studio-landing.component';

describe('StudioLandingComponent', () => {
  let component: StudioLandingComponent;
  let fixture: ComponentFixture<StudioLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudioLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
