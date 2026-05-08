import { Article } from '../../../models/article';

export interface ArticleResponse {
  articles: Article[];
  total: number;
}