import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassConfirmationDialogComponent } from './class-confirmation-dialog.component';

describe('ClassConfirmationDialogComponent', () => {
  let component: ClassConfirmationDialogComponent;
  let fixture: ComponentFixture<ClassConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
