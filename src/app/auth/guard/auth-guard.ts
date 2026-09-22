import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { inject } from '@angular/core';

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};

// export const adminChildGuard: CanActivateChildFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.hasRole('ROLE_ADMIN')) {
//     return true;
//   }

//   return router.createUrlTree(['/todos']);
// };
