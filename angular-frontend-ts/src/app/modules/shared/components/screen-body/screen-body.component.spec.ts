import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenBodyComponent } from './screen-body.component';

describe('ScreenBodyComponent', () => {
  let component: ScreenBodyComponent;
  let fixture: ComponentFixture<ScreenBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
