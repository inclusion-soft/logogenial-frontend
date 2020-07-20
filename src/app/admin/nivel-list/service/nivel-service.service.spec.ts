import { TestBed } from '@angular/core/testing';

import { NivelServiceService } from './nivel-service.service';

describe('NivelServiceService', () => {
  let service: NivelServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NivelServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
