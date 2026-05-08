import { Observable } from 'rxjs';
import { Article } from '../../models/article';
import { ArticleResponse } from './types/article-response';

export interface IArticlesService {
  getArticles(page: number, pageSize: number): Observable<ArticleResponse>;
  addArticle(article: Article): Observable<ArticleResponse>;
  updateArticle(article: Article): Observable<ArticleResponse>;
  deleteArticle(id: number): Observable<ArticleResponse>;
}