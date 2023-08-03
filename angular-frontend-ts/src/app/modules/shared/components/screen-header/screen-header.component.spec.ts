import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenHeaderComponent } from './screen-header.component';

describe('ScreenHeaderComponent', () => {
  let component: ScreenHeaderComponent;
  let fixture: ComponentFixture<ScreenHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
