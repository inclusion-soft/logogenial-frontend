import { TestBed } from '@angular/core/testing';

import { PersonaDatasourceService } from './persona-datasource.service';

describe('PersonaDatasourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonaDatasourceService = TestBed.get(PersonaDatasourceService);
    expect(service).toBeTruthy();
  });
});
