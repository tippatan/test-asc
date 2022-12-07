import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDetailTbbComponent } from './activity-detail-tbb.component';

describe('ActivityDetailTbbComponent', () => {
  let component: ActivityDetailTbbComponent;
  let fixture: ComponentFixture<ActivityDetailTbbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDetailTbbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDetailTbbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
