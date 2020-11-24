import { TestBed } from '@angular/core/testing';

import { DatageniaDatasourceService } from './datagenia-datasource.service';

describe('DatageniaDatasourceService', () => {
  let service: DatageniaDatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatageniaDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
