import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly loginForm = new FormGroup({
    username: new FormControl('bastien@example.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('tacostacos', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService
      .login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .subscribe({
        next: () => this.router.navigate(['/todos']),
        error: (err) => console.error('Erreur de connexion', err),
      });
  }
}
