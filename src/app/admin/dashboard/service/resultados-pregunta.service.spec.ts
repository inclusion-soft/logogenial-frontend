import { TestBed } from '@angular/core/testing';

import { ResultadosPreguntaService } from './resultados-pregunta.service';

describe('ResultadosPreguntaService', () => {
  let service: ResultadosPreguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosPreguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
