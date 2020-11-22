import { TestBed } from '@angular/core/testing';

import { GrupoEstudianteService } from './grupo-estudiante.service';

describe('GrupoEstudianteService', () => {
  let service: GrupoEstudianteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoEstudianteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
