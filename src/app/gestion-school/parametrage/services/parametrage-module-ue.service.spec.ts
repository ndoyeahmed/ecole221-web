import { TestBed } from '@angular/core/testing';

import { ParametrageModuleUeService } from './parametrage-module-ue.service';

describe('ParametrageModuleUeService', () => {
  let service: ParametrageModuleUeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrageModuleUeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
