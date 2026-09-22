import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth-guard';

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
    canActivate: [AuthGuard],
    data: { authorities: ['ROLE_USER', 'ROLE_ADMIN'] },
  },
  { path: '**', redirectTo: '' },
];
