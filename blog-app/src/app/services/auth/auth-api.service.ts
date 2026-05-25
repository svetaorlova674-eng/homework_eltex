import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { IAuthService } from './auth-service.interface';
import { User, LoginDto, RegisterDto, AuthResponse } from './auth.types';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'current_user';

@Injectable()
export class AuthApiService implements IAuthService {
  private http = inject(HttpClient);
  private currentUser = signal<User | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  );

  login(dto: LoginDto): Observable<User> {
    return this.http.post<AuthResponse>('/api/auth/login', dto).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
      }),
      map(res => res.user)
    );
  }

  register(dto: RegisterDto): Observable<User> {
    return this.http.post<User>('/api/users/register', dto).pipe(
      map(user => user)
    );
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}).subscribe();
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