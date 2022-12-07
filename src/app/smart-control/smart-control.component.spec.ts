import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartControlComponent } from './smart-control.component';

describe('SmartControlComponent', () => {
  let component: SmartControlComponent;
  let fixture: ComponentFixture<SmartControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
