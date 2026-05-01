import { InjectionToken } from '@angular/core';
import { IArticlesService } from './articles-service.interface';

export const ARTICLES_SERVICE_TOKEN = new InjectionToken<IArticlesService>('ArticlesService');