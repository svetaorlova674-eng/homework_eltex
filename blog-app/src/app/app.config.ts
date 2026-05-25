import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ARTICLES_SERVICE_TOKEN } from './services/articles/articles-service.token';
import { ArticlesService } from './services/articles/articles.service';
import { ArticlesApiService } from './services/articles/articles-api.service';
import { POST_SERVICE_TOKEN } from './services/post/post-service.token';
import { PostService } from './services/post/post.service';
import { PostGraphqlService } from './services/post/post-graphql.service';
import { AUTH_SERVICE_TOKEN } from './services/auth/auth-service.token';
import { AuthLocalService } from './services/auth/auth-local.service';
import { AuthApiService } from './services/auth/auth-api.service';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: '/graphql' }),
        cache: new InMemoryCache()
      };
    }),
    {
      provide: ARTICLES_SERVICE_TOKEN,
      useClass: environment.useApi ? ArticlesApiService : ArticlesService
    },
    {
      provide: POST_SERVICE_TOKEN,
      useClass: environment.useApi ? PostGraphqlService : PostService
    },
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: environment.useApi ? AuthApiService : AuthLocalService
    }
  ]
};