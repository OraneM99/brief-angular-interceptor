import { Routes } from '@angular/router';
import { authGuard } from './auth/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./auth/login/login.component').then(({ LoginComponent }) => LoginComponent),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./todos/todos/todos.component').then(({ TodosComponent }) => TodosComponent),
    canActivate: [authGuard],
    data: { authorities: ['ROLE_USER', 'ROLE_ADMIN'] },
  },
  { path: '**', redirectTo: '' },
];
