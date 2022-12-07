import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineHorizontalComponent } from './timeline-horizontal.component';

describe('TimelineHorizontalComponent', () => {
  let component: TimelineHorizontalComponent;
  let fixture: ComponentFixture<TimelineHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineHorizontalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
