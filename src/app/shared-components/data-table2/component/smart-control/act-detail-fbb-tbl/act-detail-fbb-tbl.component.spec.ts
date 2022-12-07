import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActDetailFbbTblComponent } from './act-detail-fbb-tbl.component';

describe('ActDetailFbbTblComponent', () => {
  let component: ActDetailFbbTblComponent;
  let fixture: ComponentFixture<ActDetailFbbTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActDetailFbbTblComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActDetailFbbTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
