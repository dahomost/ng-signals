import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

/** Deployed API Gateway endpoint (dev stage). */
const REGISTER_PATH = 'https://9clpwaoipj.execute-api.us-east-1.amazonaws.com/api/v1/register';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  /** Show invalid styling after submit attempt or blur (handled via touched). */
  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]],
    phoneNumber: ['', [Validators.required]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)],
    ],
    confirmPassword: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    ssn: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]],
  });

  passwordsMatch(): boolean {
    const { password, confirmPassword } = this.form.getRawValue();
    return password.trim() === confirmPassword.trim();
  }

  fieldMessage(controlName: string): string {
    const c = this.form.get(controlName);
    if (!c?.errors || (!c.touched && !c.dirty)) {
      return '';
    }
    const e = c.errors;
    if (e['required']) {
      return 'This field is required.';
    }
    if (e['minlength']) {
      const need = (e['minlength'] as { requiredLength: number }).requiredLength;
      return `Enter at least ${need} characters.`;
    }
    if (e['email']) {
      return 'Enter a valid email address.';
    }
    if (e['pattern']) {
      if (controlName === 'ssn') {
        return 'Use format 111-22-3333.';
      }
      if (controlName === 'password') {
        return 'Password must contain letters and numbers.';
      }
      if (controlName === 'email') {
        return 'Enter a valid email address.';
      }
    }
    return '';
  }

  confirmPasswordMessage(): string {
    const pw = this.form.controls.password;
    const cf = this.form.controls.confirmPassword;
    if (!(cf.touched || pw.touched)) {
      return '';
    }
    if (!this.passwordsMatch() && pw.value.length > 0 && cf.value.length > 0) {
      return 'Passwords do not match.';
    }
    return '';
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.passwordsMatch()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const v = this.form.getRawValue();
    const payload = {
      first_name: v.firstName.trim(),
      last_name: v.lastName.trim(),
      email: v.email.trim(),
      password: v.password,
      phone_number: v.phoneNumber.trim(),
      address: v.address.trim(),
      ssn: v.ssn.trim(),
    };

    this.http.post(REGISTER_PATH, payload).subscribe({
      next: () => {
        this.success.set('Account created');
        this.form.reset();
        this.loading.set(false);
      },
      error: (err: unknown) => {
        const status = err instanceof HttpErrorResponse ? err.status : 0;
        if (status === 409) {
          this.error.set('Email already registered');
        } else {
          this.error.set('Signup failed');
        }
        this.loading.set(false);
      },
    });
  }
}
