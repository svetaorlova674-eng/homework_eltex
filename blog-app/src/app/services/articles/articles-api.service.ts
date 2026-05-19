import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';
import { IArticlesService } from './articles-service.interface';
import { ArticleResponse } from './types/article-response';
import { ArticlesMapperService } from './articles-mapper.service';
import { ArticlesApiResponse, ArticleApi } from './types/article-api';
import { Article } from '../../models/article';
import { Category } from './types/category';

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
      categories: this.http.get<Category[]>('/api/categories')
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
    const categoryId = article.categoryId?.trim();
    const categoryName = article.category?.trim();

    let category$: Observable<Category | null> = of(
      categoryId ? { id: categoryId, name: categoryName ?? '' } : null
    );

    if (categoryName && !categoryId) {
      category$ = this.http.post<Category>('/api/categories', { name: categoryName });
    }

    return category$.pipe(
      switchMap((category: Category | null) => {
        const formData = new FormData();
        formData.append('title', article.title);
        formData.append('content', article.description);
        if (category) formData.append('categoryId', category.id);
        if (file) formData.append('image', file);
        return this.http.post<ArticleApi>('/api/articles', formData).pipe(
          map(res => ({
            articles: [this.mapper.fromApi(res, category ? new Map([[category.id, category.name]]) : new Map())],
            total: 1
          }))
        );
      })
    );
  }

  updateArticle(article: Article, file?: File): Observable<ArticleResponse> {
    const categoryId = article.categoryId?.trim();
    const categoryName = article.category?.trim();

    let category$: Observable<Category | null> = of(
      categoryId ? { id: categoryId, name: categoryName ?? '' } : null
    );

    if (categoryName && !categoryId) {
      category$ = this.http.get<Category[]>('/api/categories').pipe(
        switchMap(categories => {
          const existing = categories.find(c => c.name === categoryName);
          if (existing) return of(existing);
          return this.http.post<Category>('/api/categories', { name: categoryName });
        })
      );
    }

    return category$.pipe(
      switchMap((category: Category | null) => {
        const formData = new FormData();
        formData.append('title', article.title);
        formData.append('content', article.description);
        if (category) formData.append('categoryId', category.id);
        if (file) formData.append('image', file);
        return this.http.patch<ArticleApi>(`/api/articles/${article.id}`, formData).pipe(
          map(res => ({
            articles: [this.mapper.fromApi(res, category ? new Map([[category.id, category.name]]) : new Map())],
            total: 1
          }))
        );
      })
    );
  }

  deleteArticle(id: string): Observable<ArticleResponse> {
    return this.http.delete<void>(`/api/articles/${id}`).pipe(
      map(() => ({ articles: [], total: 0 }))
    );
  }
}