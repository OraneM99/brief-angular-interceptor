import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const requiredAuthorities = route.data['authorities'] as string[] | undefined;
  if (!requiredAuthorities || requiredAuthorities.length === 0) {
    return true;
  }

  const hasAccess = requiredAuthorities.some((role) => auth.hasRole(role));
  if (!hasAccess) {
    return router.createUrlTree(['/todos']);
  }

  return true;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!auth.hasRole('ROLE_ADMIN')) {
    return router.createUrlTree(['/']);
  }

  return true;
};
