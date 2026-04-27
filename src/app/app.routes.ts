import { Routes } from '@angular/router';
import { SignupComponent } from './features/signup/signup.component';

export const routes: Routes = [{ path: '', pathMatch: 'full', redirectTo: 'signup' }, { path: 'signup', component: SignupComponent }];
