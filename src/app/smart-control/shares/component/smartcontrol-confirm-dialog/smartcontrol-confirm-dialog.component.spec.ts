import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartcontrolConfirmDialogComponent } from './smartcontrol-confirm-dialog.component';

describe('SmartcontrolConfirmDialogComponent', () => {
  let component: SmartcontrolConfirmDialogComponent;
  let fixture: ComponentFixture<SmartcontrolConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartcontrolConfirmDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartcontrolConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
