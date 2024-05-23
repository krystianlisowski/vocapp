import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },

  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./vocabulary-details/vocabulary-details.component').then(
        (c) => c.VocabularyDetailsComponent
      ),
  },
];
