import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin } from 'rxjs';
import { IArticlesService } from './articles-service.interface';
import { ArticleResponse } from './types/article-response';
import { ArticlesMapperService } from './articles-mapper.service';
import { ArticlesApiResponse } from './types/article-api';
import { Article } from '../../models/article';

interface CategoryApi {
  id: string;
  name: string;
}

@Injectable()
export class ArticlesApiService implements IArticlesService {
  private http = inject(HttpClient);
  private mapper = inject(ArticlesMapperService);

  getArticles(page: number, pageSize: number): Observable<ArticleResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', pageSize);

    return forkJoin({
      articles: this.http.get<ArticlesApiResponse>('/api/articles', { params }),
      categories: this.http.get<CategoryApi[]>('/api/categories')
    }).pipe(
      map(({ articles, categories }) => {
        const categoryMap = new Map(categories.map(c => [c.id, c.name]));
        return {
          articles: articles.items.map(a => this.mapper.fromApi(a, categoryMap)),
          total: articles.total
        };
      })
    );
  }

  addArticle(article: Article, file?: File): Observable<ArticleResponse> {
    const categoryName = article.category?.trim();

    if (categoryName) {
      return this.http.post<CategoryApi>('/api/categories', { name: categoryName }).pipe(
        switchMap((category: CategoryApi) => {
          const formData = new FormData();
          formData.append('title', article.title);
          formData.append('content', article.description);
          formData.append('categoryId', category.id);
          if (file) formData.append('image', file);
          return this.http.post<any>('/api/articles', formData).pipe(
            map(res => ({ articles: [this.mapper.fromApi(res, new Map([[category.id, category.name]]))], total: 1 }))
          );
        })
      );
    }

    const formData = new FormData();
    formData.append('title', article.title);
    formData.append('content', article.description);
    if (file) formData.append('image', file);

    return this.http.post<any>('/api/articles', formData).pipe(
      map(res => ({ articles: [this.mapper.fromApi(res, new Map())], total: 1 }))
    );
  }

  updateArticle(article: Article, file?: File): Observable<ArticleResponse> {
    const categoryName = article.category?.trim();

    if (categoryName) {
      return this.http.get<CategoryApi[]>('/api/categories').pipe(
        switchMap(categories => {
          const existing = categories.find(c => c.name === categoryName);
          if (existing) {
            return this.patchArticle(article, existing.id, existing.name, file);
          }
          return this.http.post<CategoryApi>('/api/categories', { name: categoryName }).pipe(
            switchMap(category => this.patchArticle(article, category.id, category.name, file))
          );
        })
      );
    }

    return this.patchArticle(article, undefined, undefined, file);
  }

  private patchArticle(article: Article, categoryId?: string, categoryName?: string, file?: File): Observable<ArticleResponse> {
    const formData = new FormData();
    formData.append('title', article.title);
    formData.append('content', article.description);
    if (categoryId) formData.append('categoryId', categoryId);
    if (file) formData.append('image', file);

    const categoryMap = categoryId && categoryName
      ? new Map([[categoryId, categoryName]])
      : new Map<string, string>();

    return this.http.patch<any>(`/api/articles/${article.id}`, formData).pipe(
      map(res => ({ articles: [this.mapper.fromApi(res, categoryMap)], total: 1 }))
    );
  }

  deleteArticle(id: string): Observable<ArticleResponse> {
    return this.http.delete<any>(`/api/articles/${id}`).pipe(
      map(() => ({ articles: [], total: 0 }))
    );
  }
}