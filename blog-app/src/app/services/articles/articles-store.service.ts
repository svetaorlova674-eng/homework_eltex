import { Injectable, signal } from '@angular/core';
import { Article } from '../../models/article';


@Injectable({
  providedIn: 'root'
})
export class ArticlesStoreService {
  articles = signal<Article[]>([]);
  currentPage = signal<number>(1);
  total = signal<number>(0);

  saveArticles(articles: Article[]): void {
    this.articles.set(articles);
  }

  savePage(page: number): void {
    this.currentPage.set(page);
  }

  saveTotal(total: number): void {
    this.total.set(total);
  }
}