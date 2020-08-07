import { TestBed } from '@angular/core/testing';

import { DatageniaService } from './datagenia.service';

describe('DatageniaService', () => {
  let service: DatageniaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatageniaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
