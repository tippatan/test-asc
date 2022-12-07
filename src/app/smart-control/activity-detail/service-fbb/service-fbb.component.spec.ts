import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFbbComponent } from './service-fbb.component';

describe('ServiceFbbComponent', () => {
  let component: ServiceFbbComponent;
  let fixture: ComponentFixture<ServiceFbbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceFbbComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFbbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
