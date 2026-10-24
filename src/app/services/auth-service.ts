import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserService } from './user-service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userService = inject(UserService);

  isAuthenticated = signal<boolean>(localStorage.getItem('session') === 'true');
  currentRol = signal<string | null>(localStorage.getItem('rol'));

  login(email: string, password: string): Observable<boolean> {
    return this.userService.findByCredentials(email, password).pipe(
      map((user) => {
        if (!user) {
          return false;
        }
        const { password: _password, ...safeUser } = user;
        localStorage.setItem('session', 'true');
        localStorage.setItem('user', JSON.stringify(safeUser));
        localStorage.setItem('rol', user.rol);
        this.isAuthenticated.set(true);
        this.currentRol.set(user.rol);
        return true;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('session');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    this.isAuthenticated.set(false);
    this.currentRol.set(null);
  }

  currentUser(): Omit<User, 'password'> | null {
    const raw = localStorage.getItem('user');
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
