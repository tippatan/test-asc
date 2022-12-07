import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbCustomComponent } from './breadcrumb-custom.component';

describe('BreadcrumbCustomComponent', () => {
  let component: BreadcrumbCustomComponent;
  let fixture: ComponentFixture<BreadcrumbCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreadcrumbCustomComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
