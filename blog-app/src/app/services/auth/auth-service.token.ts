import { InjectionToken } from '@angular/core';
import { IAuthService } from './auth-service.interface';

export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthService>('AuthService');