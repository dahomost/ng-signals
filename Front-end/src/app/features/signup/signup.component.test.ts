import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SignupComponent } from './signup.component';

describe('SignupComponent (Vitest)', () => {
  let component: SignupComponent;
  let httpPostMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    httpPostMock = vi.fn();

    TestBed.configureTestingModule({
      providers: [FormBuilder, { provide: HttpClient, useValue: { post: httpPostMock } }]
    });

    component = TestBed.runInInjectionContext(() => new SignupComponent());
    vi.clearAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('returns false when passwords do not match', () => {
    component.form.patchValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'StrongPass1',
      confirmPassword: 'Different1'
    });

    expect(component.passwordsMatch()).toBe(false);
  });

  it('sets error and skips request when form is invalid', () => {
    component.form.patchValue({
      firstName: 'J',
      email: 'bad-email',
      password: 'weak',
      confirmPassword: 'weak'
    });

    component.submit();

    expect(component.error()).toBe('Invalid form');
    expect(httpPostMock).not.toHaveBeenCalled();
  });

  it('submits signup and sets success state on success', () => {
    httpPostMock.mockReturnValue(of({}));

    component.form.patchValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'StrongPass1',
      confirmPassword: 'StrongPass1'
    });

    component.submit();

    expect(httpPostMock).toHaveBeenCalledWith(
      '/api/signup',
      expect.objectContaining({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'StrongPass1',
        role: 'user',
        is_active: true
      })
    );
    expect(component.success()).toBe('Account created');
    expect(component.loading()).toBe(false);
  });

  it('sets error state when API request fails', () => {
    httpPostMock.mockReturnValue(throwError(() => new Error('fail')));

    component.form.patchValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'StrongPass1',
      confirmPassword: 'StrongPass1'
    });

    component.submit();

    expect(component.error()).toBe('Signup failed');
    expect(component.loading()).toBe(false);
  });
});
