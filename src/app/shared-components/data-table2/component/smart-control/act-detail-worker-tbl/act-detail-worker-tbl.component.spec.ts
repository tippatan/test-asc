import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActDetailWorkerTblComponent } from './act-detail-worker-tbl.component';

describe('ActDetailWorkerTblComponent', () => {
  let component: ActDetailWorkerTblComponent;
  let fixture: ComponentFixture<ActDetailWorkerTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActDetailWorkerTblComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActDetailWorkerTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
