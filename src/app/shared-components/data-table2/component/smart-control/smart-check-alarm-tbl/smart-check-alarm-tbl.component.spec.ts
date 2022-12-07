import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCheckAlarmTblComponent } from './smart-check-alarm-tbl.component';

describe('SmartCheckAlarmTblComponent', () => {
  let component: SmartCheckAlarmTblComponent;
  let fixture: ComponentFixture<SmartCheckAlarmTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartCheckAlarmTblComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCheckAlarmTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
