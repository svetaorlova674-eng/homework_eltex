import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { IPostService } from './post-service.interface';
import { PostDetail } from './types/post-detail';
import { Comment } from './types/comment';

@Injectable()
export class PostApiService implements IPostService {
  private http = inject(HttpClient);

  getPost(id: string): Observable<PostDetail> {
    return forkJoin({
      article: this.http.get<any>(`/api/articles/${id}`),
      comments: this.http.get<any[]>(`/api/comments/article/${id}`)
    }).pipe(
      map(({ article, comments }) => ({
        id: String(article.id),
        title: article.title,
        description: article.content,
        image: article.imgSrc ?? 'images/paris.png',
        rating: article.rating ?? 0,
        comments: comments.map((c: any) => ({
          id: String(c.id),
          author: c.username,
          text: c.content,
          rating: c.rating ?? 0,
          date: new Date(c.createdAt).toLocaleDateString()
        }))
      }))
    );
  }

  updatePostRating(postId: string, rating: number): Observable<PostDetail> {
    return this.http.post<any>(`/api/articles/vote/${postId}`, { vote: rating }).pipe(
      switchMap(() => this.getPost(postId))
    );
  }

  updateCommentRating(postId: string, commentId: string, rating: number): Observable<PostDetail> {
    return this.http.patch<any>(`/api/comments/${commentId}/rating`, { rating }).pipe(
      switchMap(() => this.getPost(postId))
    );
  }

  addComment(postId: string, comment: Omit<Comment, 'id' | 'date'>): Observable<PostDetail> {
    return this.http.post<any>('/api/comments', {
      articleId: postId,
      username: comment.author,
      content: comment.text
    }).pipe(
      switchMap(() => this.getPost(postId))
    );
  }
}