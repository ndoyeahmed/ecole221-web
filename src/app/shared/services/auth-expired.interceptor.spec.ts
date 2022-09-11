import { TestBed } from '@angular/core/testing';

import { AuthExpiredInterceptor } from './auth-expired.interceptor';

describe('AuthExpiredInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthExpiredInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthExpiredInterceptor = TestBed.inject(AuthExpiredInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
