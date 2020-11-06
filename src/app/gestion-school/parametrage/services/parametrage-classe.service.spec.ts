import { TestBed } from '@angular/core/testing';

import { ParametrageClasseService } from './parametrage-classe.service';

describe('ParametrageClasseService', () => {
  let service: ParametrageClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrageClasseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
