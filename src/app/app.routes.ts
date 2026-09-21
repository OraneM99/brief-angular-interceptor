import { Routes } from '@angular/router';

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
  },
  { path: '**', redirectTo: '' },
];
