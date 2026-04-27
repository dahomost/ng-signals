import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

/** Inline shell so Vitest/TestBed never resolves external templateUrl (see App). */
@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class AppShellTestDouble {}

describe('App', () => {
  it('exports root component', () => {
    expect(App).toBeTruthy();
  });
});

describe('App shell (router outlet)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellTestDouble, RouterTestingModule],
    }).compileComponents();
  });

  it('creates and renders a router outlet', async () => {
    const fixture = TestBed.createComponent(AppShellTestDouble);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).not.toBeNull();
  });
});
