import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEnterpriseComponent } from './service-enterprise.component';

describe('ServiceEnterpriseComponent', () => {
  let component: ServiceEnterpriseComponent;
  let fixture: ComponentFixture<ServiceEnterpriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceEnterpriseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
