import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../core/models/user.model';

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

    const user: User = {
      id: Date.now().toString(),
      first_name: this.form.value.firstName!,
      last_name: this.form.value.lastName!,
      email: this.form.value.email!,
      phone_number: this.form.value.phoneNumber || '',
      password: this.form.value.password!,
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString(),
      how_found_us: 'signup'
    };

    this.http.post('/api/signup', user).subscribe({
      next: () => {
        this.success.set('Account created');
        this.form.reset();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Signup failed');
        this.loading.set(false);
      }
    });
  }
}