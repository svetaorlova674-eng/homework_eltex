import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPostService } from './post-service.interface';
import { PostDetail } from './types/post-detail';
import { Comment } from './types/comment';

const LS_KEY = 'articles';

@Injectable()
export class PostService implements IPostService {

  private loadFromStorage(): any[] {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  }

  private saveToStorage(articles: any[]): void {
    localStorage.setItem(LS_KEY, JSON.stringify(articles));
  }

  getPost(id: string): Observable<PostDetail> {
    const articles = this.loadFromStorage();
    const article = articles.find((a: any) => String(a.id) === String(id));
    if (!article) return of({} as PostDetail);
    return of({
      id: String(article.id),
      title: article.title,
      description: article.description,
      image: article.image || 'images/post.jpg',
      rating: article.rating || 0,
      comments: (article.comments || []).map((c: any) => ({
        ...c,
        id: String(c.id)
      }))
    });
  }

  addComment(postId: string, comment: Omit<Comment, 'id' | 'date'>): Observable<PostDetail> {
    const articles = this.loadFromStorage();
    const index = articles.findIndex((a: any) => String(a.id) === String(postId));
    if (!articles[index].comments) articles[index].comments = [];
    articles[index].comments.push({
      ...comment,
      id: String(Date.now()),
      date: new Date().toLocaleDateString()
    });
    this.saveToStorage(articles);
    return this.getPost(postId);
  }

  updateCommentRating(postId: string, commentId: string, rating: number): Observable<PostDetail> {
    const articles = this.loadFromStorage();
    const index = articles.findIndex((a: any) => String(a.id) === String(postId));
    const commentIndex = articles[index].comments.findIndex((c: any) => String(c.id) === String(commentId));
    articles[index].comments[commentIndex].rating = rating;
    this.saveToStorage(articles);
    return this.getPost(postId);
  }

  updatePostRating(postId: string, rating: number): Observable<PostDetail> {
    const articles = this.loadFromStorage();
    const index = articles.findIndex((a: any) => String(a.id) === String(postId));
    articles[index].rating = rating;
    this.saveToStorage(articles);
    return this.getPost(postId);
  }
}