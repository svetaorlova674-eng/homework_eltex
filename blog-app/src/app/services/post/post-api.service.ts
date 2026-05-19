import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { IPostService } from './post-service.interface';
import { PostDetail } from './types/post-detail';
import { Comment } from './types/comment';

@Injectable()
export class PostApiService implements IPostService {
  private http = inject(HttpClient);

  getPost(id: number): Observable<PostDetail> {
    return forkJoin({
      article: this.http.get<any>(`/api/articles/${id}`),
      comments: this.http.get<any[]>(`/api/comments/article/${id}`)
    }).pipe(
      map(({ article, comments }) => ({
        id: article.id,
        title: article.title,
        description: article.content,
        image: article.imgSrc ?? 'images/post.jpg',
        rating: article.rating ?? 0,
        comments: comments.map((c: any) => ({
          id: c.id,
          author: c.username,
          text: c.content,
          rating: c.rating ?? 0,
          date: new Date(c.createdAt).toLocaleDateString()
        }))
      }))
    );
  }

  updatePostRating(postId: number, rating: number): Observable<PostDetail> {
    return this.http.post<any>(`/api/articles/vote/${postId}`, { vote: rating }).pipe(
      switchMap(() => this.getPost(postId))
    );
  }

  updateCommentRating(postId: number, commentId: number, rating: number): Observable<PostDetail> {
    return this.http.patch<any>(`/api/comments/${commentId}/rating`, { rating }).pipe(
      switchMap(() => this.getPost(postId))
    );
  }

  addComment(postId: number, comment: Omit<Comment, 'id' | 'date'>): Observable<PostDetail> {
    return this.http.post<any>('/api/comments', {
      articleId: String(postId),
      username: comment.author,
      content: comment.text
    }).pipe(
      switchMap(() => this.getPost(postId))
    );
  }
}