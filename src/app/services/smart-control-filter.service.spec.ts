import { TestBed } from '@angular/core/testing';

import { SmartControlFilterService } from './smart-control-filter.service';

describe('SmartControlFilterService', () => {
  let service: SmartControlFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartControlFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
