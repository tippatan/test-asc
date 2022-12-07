import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActDetailEnterpriseTblComponent } from './act-detail-enterprise-tbl.component';

describe('ActDetailEnterpriseTblComponent', () => {
  let component: ActDetailEnterpriseTblComponent;
  let fixture: ComponentFixture<ActDetailEnterpriseTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActDetailEnterpriseTblComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActDetailEnterpriseTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
