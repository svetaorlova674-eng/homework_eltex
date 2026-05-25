import { Observable } from 'rxjs';
import { Signal } from '@angular/core';
import { User, LoginDto, RegisterDto } from './auth.types';

export interface IAuthService {
  login(dto: LoginDto): Observable<User>;
  register(dto: RegisterDto): Observable<User>;
  logout(): void;
  getUser(): Signal<User | null>;
  isLoggedIn(): boolean;
}