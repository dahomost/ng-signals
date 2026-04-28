import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['']
  });

  readonly passwordsMatch = computed(() => {
    const { password, confirmPassword } = this.form.value;
    return password === confirmPassword;
  });

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.passwordsMatch()) {
      this.error.set('Invalid form');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const payload = {
      first_name: this.form.value.firstName!,
      last_name: this.form.value.lastName!,
      email: this.form.value.email!,
      password: this.form.value.password!,
      phone_number: this.form.value.phoneNumber || '',
      address: '',
      ssn: ''
    };

    // Dev: `ng serve` uses proxy.conf.json → http://127.0.0.1:31500 (serverless-offline).
    this.http.post('/api/v1/register', payload).subscribe({
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
      }
    });
  }
}