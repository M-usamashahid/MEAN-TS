import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuLogoComponent } from './side-menu-logo.component';

describe('SideMenuLogoComponent', () => {
  let component: SideMenuLogoComponent;
  let fixture: ComponentFixture<SideMenuLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
