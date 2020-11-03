import { TestBed } from '@angular/core/testing';

import { ParametrageReferentielService } from './parametrage-referentiel.service';

describe('ParametrageReferentielService', () => {
  let service: ParametrageReferentielService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrageReferentielService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
