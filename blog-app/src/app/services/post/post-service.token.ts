import { InjectionToken } from '@angular/core';
import { IPostService } from './post-service.interface';

export const POST_SERVICE_TOKEN = new InjectionToken<IPostService>('PostService');