import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/models/user.interface';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/auth';

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, user).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
      }),
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
}
