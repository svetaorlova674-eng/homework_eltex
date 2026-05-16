import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
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
    }
  ]
};