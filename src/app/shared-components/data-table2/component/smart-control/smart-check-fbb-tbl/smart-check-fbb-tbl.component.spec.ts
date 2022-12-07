import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCheckFbbTblComponent } from './smart-check-fbb-tbl.component';

describe('SmartCheckFbbTblComponent', () => {
  let component: SmartCheckFbbTblComponent;
  let fixture: ComponentFixture<SmartCheckFbbTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartCheckFbbTblComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCheckFbbTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
