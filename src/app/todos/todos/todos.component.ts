import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TodoItem } from '../../core/models/todo-item.model';
import { TodoService } from '../todos.service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todos.component.html',
})
export class TodosComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly todoList = signal<TodoItem[]>([]);
  protected readonly todoForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  protected readonly isAdmin = signal(this.authService.hasRole('ROLE_ADMIN'));

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((todos) => this.todoList.set(todos));
  }

  protected async submit(): Promise<void> {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const todo = await firstValueFrom(
      this.todoService.createTodo(this.todoForm.controls.title.value),
    );
    this.todoList.update((todos) => [...todos, todo]);
    this.todoForm.reset({ title: '' });
  }

  protected async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigate(['/']);
  }
}
