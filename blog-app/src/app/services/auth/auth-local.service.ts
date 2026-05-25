import { Injectable, signal, Signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAuthService } from './auth-service.interface';
import { User, LoginDto, RegisterDto } from './auth.types';

const USERS_KEY = 'users';
const TOKEN_KEY = 'access_token';
const USER_KEY = 'current_user';

@Injectable()
export class AuthLocalService implements IAuthService {
  private currentUser = signal<User | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  );

  login(dto: LoginDto): Observable<User> {
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.username === dto.username && (u as any).password === dto.password);
    if (!user) throw new Error('Неверный логин или пароль');
    const { password, ...userData } = user as any;
    localStorage.setItem(TOKEN_KEY, 'local-token-' + user.id);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    this.currentUser.set(userData);
    return of(userData);
  }

  register(dto: RegisterDto): Observable<User> {
    const users: any[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUser = {
      id: String(Date.now()),
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role: dto.isAdmin ? 'admin' : 'user'
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return this.login({ username: dto.username, password: dto.password });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  getUser(): Signal<User | null> {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}