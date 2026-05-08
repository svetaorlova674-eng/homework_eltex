import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ARTICLES_SERVICE_TOKEN } from './services/articles/articles-service.token';
import { ArticlesService } from './services/articles/articles.service';
import { POST_SERVICE_TOKEN } from './services/post/post-service.token';
import { PostService } from './services/post/post.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    {
      provide: ARTICLES_SERVICE_TOKEN,
      useClass: ArticlesService
    },
    {
      provide: POST_SERVICE_TOKEN,
      useClass: PostService
    }
  ]
};