import { Component, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import DOMPurify from 'dompurify';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
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
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]
    ],
    confirmPassword: ['']
  });

  readonly passwordsMatch = computed(() => {
    const { password, confirmPassword } = this.form.value;
    return password === confirmPassword;
  });

  constructor() {
    effect(() => {
      console.log('Form valid:', this.form.valid);
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.passwordsMatch()) {
      this.error.set('Invalid form');
      this.success.set('');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const cleanData = DOMPurify.sanitize(JSON.stringify(this.form.value));

    this.http.post('/api/signup', JSON.parse(cleanData)).subscribe({
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
