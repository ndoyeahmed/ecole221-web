import { TestBed } from '@angular/core/testing';

import { ParametragesSpecialiteService } from './parametrages-specialite.service';

describe('ParametragesSpecialiteService', () => {
  let service: ParametragesSpecialiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametragesSpecialiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
