import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCheckComponent } from './smart-check.component';

describe('SmartCheckComponent', () => {
  let component: SmartCheckComponent;
  let fixture: ComponentFixture<SmartCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartCheckComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
