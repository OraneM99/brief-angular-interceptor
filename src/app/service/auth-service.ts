import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  /* Il faut décoder le payload du JWT pour extraire le rôle */
  private decodeToken(token: string) {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  /* Puis transformer le 'scope' en tableau */
  private extractAuthorities(token: string): string[] {
    const payload = this.decodeToken(token);
    return payload.scope ? payload.scope.split(' ') : [];
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /* Récupération du role de l'utilisateur */
  getAuthorities(): string[] {
    const authorities = localStorage.getItem('authorities');
    return authorities ? JSON.parse(authorities) : [];
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
          const authorities = this.extractAuthorities(response.token);
          localStorage.setItem('authorities', JSON.stringify(authorities));
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
  }
}
