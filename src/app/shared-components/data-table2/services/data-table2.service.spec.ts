import { TestBed, inject } from '@angular/core/testing';

import { DataTable2Service } from './data-table2.service';

describe('DataTable2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataTable2Service],
    });
  });

  it('should be created', inject(
    [DataTable2Service],
    (service: DataTable2Service) => {
      expect(service).toBeTruthy();
    }
  ));
});
