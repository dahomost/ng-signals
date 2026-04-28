import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SignupComponent } from './signup.component';

const validBase = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phoneNumber: '1234567890',
  address: '123 Main St',
  ssn: '111-22-3333',
  password: 'StrongPass1',
  confirmPassword: 'StrongPass1',
};

describe('SignupComponent (Vitest)', () => {
  let component: SignupComponent;
  let httpPostMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    httpPostMock = vi.fn();

    TestBed.configureTestingModule({
      providers: [FormBuilder, { provide: HttpClient, useValue: { post: httpPostMock } }],
    });

    component = TestBed.runInInjectionContext(() => new SignupComponent());
    vi.clearAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('returns false when passwords do not match', () => {
    component.form.patchValue({
      ...validBase,
      confirmPassword: 'Different1',
    });

    expect(component.passwordsMatch()).toBe(false);
  });

  it('treats leading/trailing spaces as a match', () => {
    component.form.patchValue({
      ...validBase,
      password: 'Password123 ',
      confirmPassword: 'Password123',
    });

    expect(component.passwordsMatch()).toBe(true);
  });

  it('sets error and skips request when form is invalid', () => {
    component.form.patchValue({
      firstName: 'J',
      email: 'bad-email',
      phoneNumber: '',
      address: 'x',
      ssn: 'bad',
      password: 'weak',
      confirmPassword: 'weak',
    });

    component.submit();

    expect(component.error()).toBe('');
    expect(httpPostMock).not.toHaveBeenCalled();
  });

  it('submits signup and sets success state on success', () => {
    httpPostMock.mockReturnValue(of({}));

    component.form.patchValue({
      firstName: 'Razan Daho',
      lastName: 'Test',
      email: 'razan@test.com',
      phoneNumber: '1234567890',
      address: '123 Main St',
      ssn: '111-22-3333',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    component.submit();

    expect(httpPostMock).toHaveBeenCalledWith(
      'https://9clpwaoipj.execute-api.us-east-1.amazonaws.com/api/v1/register',
      expect.objectContaining({
        first_name: 'Razan Daho',
        last_name: 'Test',
        email: 'razan@test.com',
        password: 'Password123',
        phone_number: '1234567890',
        address: '123 Main St',
        ssn: '111-22-3333',
      }),
    );
    expect(component.success()).toBe('Account created');
    expect(component.loading()).toBe(false);
  });

  it('sets error state when API request fails', () => {
    httpPostMock.mockReturnValue(throwError(() => new Error('fail')));

    component.form.patchValue(validBase);

    component.submit();

    expect(component.error()).toBe('Signup failed');
    expect(component.loading()).toBe(false);
  });
});
