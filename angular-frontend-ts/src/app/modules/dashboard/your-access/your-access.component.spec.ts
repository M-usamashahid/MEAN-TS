import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourAccessComponent } from './your-access.component';

describe('YourAccessComponent', () => {
  let component: YourAccessComponent;
  let fixture: ComponentFixture<YourAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
