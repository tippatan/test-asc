import { TestBed } from '@angular/core/testing';

import { SmartcontrolUtilService } from './smartcontrol-util.service';

describe('SmartcontrolUtilService', () => {
  let service: SmartcontrolUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartcontrolUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
