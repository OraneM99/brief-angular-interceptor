import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  username: string;
}

interface UserInfo {
  sub: string;
  roles: string[];
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/auth';

  private userInfo = signal<UserInfo | null>(null);
  readonly user = this.userInfo.asReadonly();

  constructor() {
    const token = this.getToken();
    if (token) {
      this.userInfo.set(this.decodeToken(token));
    }
  }

  /* Il faut décoder le payload du JWT pour extraire le rôle */
  private decodeToken(token: string): UserInfo | null {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      sub: decoded.sub,
      roles: decoded.scope ? decoded.scope.split(' ') : [],
      exp: decoded.exp,
    };
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.userInfo();
  }

  getAuthorities(): string[] {
    return this.userInfo()?.roles ?? [];
  }

  hasRole(role: string): boolean {
    return this.getAuthorities().includes(role);
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
          this.userInfo.set(this.decodeToken(response.token));
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userInfo.set(null);
  }
}
