import { TestBed } from '@angular/core/testing';

import { LoginBypassGuard } from './login-bypass.guard';

describe('LoginBypassGuard', () => {
  let guard: LoginBypassGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginBypassGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
