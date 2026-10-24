import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (ok) => {
        if (!ok) {
          alert('Credenciales incorrectas');
          return;
        }
        this.router.navigate([this.authService.currentRol() === 'ADMIN' ? '/admin' : '/catalog']);
      },
      error: (error: Error) => alert(error.message),
    });
  }
}
