import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../service/auth-service';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if ([401, 403].includes(err.status)) {
          this.authService.logout();

          this.router.navigate(['/login']);
        }

        return throwError(() => err);
      }),
    );
  }
}
