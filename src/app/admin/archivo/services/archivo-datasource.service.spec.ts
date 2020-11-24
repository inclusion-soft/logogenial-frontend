import { TestBed } from '@angular/core/testing';

import { ArchivoDatasourceService } from './archivo-datasource.service';

describe('ArchivoDatasourceService', () => {
  let service: ArchivoDatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchivoDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
