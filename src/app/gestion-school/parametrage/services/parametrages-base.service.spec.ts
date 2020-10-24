import { TestBed } from '@angular/core/testing';

import { ParametragesBaseService } from './parametrages-base.service';

describe('ParametragesBaseService', () => {
  let service: ParametragesBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametragesBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
