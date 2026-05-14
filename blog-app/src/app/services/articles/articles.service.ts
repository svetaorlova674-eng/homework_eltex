import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article } from '../../models/article';
import { IArticlesService } from './articles-service.interface';
import { ArticleResponse } from './types/article-response';

const LS_KEY = 'articles';

@Injectable()
export class ArticlesService implements IArticlesService {

  private loadFromStorage(): Article[] {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  }

  private saveToStorage(articles: Article[]): void {
    localStorage.setItem(LS_KEY, JSON.stringify(articles));
  }

  private getResponse(articles: Article[], page: number, pageSize: number): ArticleResponse {
    const total = articles.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      articles: articles.slice(start, end),
      total
    };
  }

  getArticles(page: number, pageSize: number): Observable<ArticleResponse> {
    const articles = this.loadFromStorage();
    return of(this.getResponse(articles, page, pageSize));
  }

addArticle(article: Article, file?: File): Observable<ArticleResponse> {
  const articles = this.loadFromStorage();
  const newArticle = { ...article, id: String(Date.now()) };
  articles.push(newArticle);
  this.saveToStorage(articles);
  const page = Math.ceil(articles.length / 7);
  return of(this.getResponse(articles, page, 7));
}

updateArticle(article: Article, file?: File): Observable<ArticleResponse> {
  const articles = this.loadFromStorage();
  const updated = articles.map(a => a.id === article.id ? { ...a, ...article } : a);
  this.saveToStorage(updated);
  return of(this.getResponse(updated, 1, 7));
}

  deleteArticle(id: string): Observable<ArticleResponse> {
    const articles = this.loadFromStorage();
    const filtered = articles.filter(a => a.id !== id);
    this.saveToStorage(filtered);
    return of(this.getResponse(filtered, 1, 7));
  }
}