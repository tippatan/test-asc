import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCheckEnterpriseTblComponent } from './smart-check-enterprise-tbl.component';

describe('SmartCheckEnterpriseTblComponent', () => {
  let component: SmartCheckEnterpriseTblComponent;
  let fixture: ComponentFixture<SmartCheckEnterpriseTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartCheckEnterpriseTblComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCheckEnterpriseTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
