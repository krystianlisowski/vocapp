import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../data-access/auth.service';
import { StoredUrlService } from '../utils/stored-url.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const urlStore = inject(StoredUrlService);

  if (authService.user()) {
    return true;
  }

  urlStore.storeUrl(state.url);
  return router.parseUrl('/login');
};
