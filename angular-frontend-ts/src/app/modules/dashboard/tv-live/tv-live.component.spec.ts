import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvLiveComponent } from './tv-live.component';

describe('TvLiveComponent', () => {
  let component: TvLiveComponent;
  let fixture: ComponentFixture<TvLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TvLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TvLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
