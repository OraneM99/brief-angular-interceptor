import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../service/auth-service';
import { inject } from '@angular/core';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (!token) {
    return next(req);
  }

  const headers = new HttpHeaders({
    Authorization: token,
  });

  const newReq = req.clone({
    headers,
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erreur de la requête: ', error);
      return throwError(error);
    }),
  );
}
