import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiTabComponent } from './noti-tab.component';

describe('NotiTabComponent', () => {
  let component: NotiTabComponent;
  let fixture: ComponentFixture<NotiTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotiTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotiTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
