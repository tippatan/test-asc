import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActDetailFbbTbbTblComponent } from './act-detail-fbb-tbb-tbl.component';

describe('ActDetailFbbTbbTblComponent', () => {
  let component: ActDetailFbbTbbTblComponent;
  let fixture: ComponentFixture<ActDetailFbbTbbTblComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActDetailFbbTbbTblComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActDetailFbbTbbTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
