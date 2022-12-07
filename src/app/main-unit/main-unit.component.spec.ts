import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUnitComponent } from './main-unit.component';

describe('MainUnitComponent', () => {
  let component: MainUnitComponent;
  let fixture: ComponentFixture<MainUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainUnitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
