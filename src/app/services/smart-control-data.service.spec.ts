import { TestBed } from '@angular/core/testing';

import { SmartControlDataService } from './smart-control-data.service';

describe('SmartControlDataService', () => {
  let service: SmartControlDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartControlDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
