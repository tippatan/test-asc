import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActDetailAlarmTblComponent } from './act-detail-alarm-tbl.component';

describe('ActDetailAlarmTblComponent', () => {
  let component: ActDetailAlarmTblComponent;
  let fixture: ComponentFixture<ActDetailAlarmTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActDetailAlarmTblComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActDetailAlarmTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
