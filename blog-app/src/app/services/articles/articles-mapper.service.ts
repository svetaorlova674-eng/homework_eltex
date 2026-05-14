import { Injectable } from '@angular/core';
import { Article } from '../../models/article';
import { ArticleApi } from './types/article-api';

@Injectable({ providedIn: 'root' })
export class ArticlesMapperService {
  fromApi(api: ArticleApi, categoryMap: Map<string, string> = new Map()): Article {
    return {
      id: api.id,
      title: api.title,
      description: api.content,
      category: categoryMap.get(api.categoryId) ?? api.categoryId ?? '',
      image: api.imgSrc ? api.imgSrc : 'images/post.jpg',
      imageAlt: api.title
    };
  }

  toApi(article: Article): { title: string; content: string; categoryId?: string } {
    return {
      title: article.title,
      content: article.description,
      categoryId: article.category || undefined
    };
  }
}