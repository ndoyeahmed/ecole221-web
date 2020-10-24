import { TestBed } from '@angular/core/testing';

import { MycustomSnackbarService } from './mycustom-snackbar.service';

describe('MycustomSnackbarService', () => {
  let service: MycustomSnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MycustomSnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
