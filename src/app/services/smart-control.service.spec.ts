import { TestBed } from '@angular/core/testing';

import { SmartControlService } from './smart-control.service';

describe('SmartControlService', () => {
  let service: SmartControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
