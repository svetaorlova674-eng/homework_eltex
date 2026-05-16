import { Observable } from 'rxjs';
import { PostDetail } from './types/post-detail';
import { Comment } from './types/comment';

export interface IPostService {
  getPost(id: string): Observable<PostDetail>;
  addComment(postId: string, comment: Omit<Comment, 'id' | 'date'>): Observable<PostDetail>;
  updateCommentRating(postId: string, commentId: string, rating: number): Observable<PostDetail>;
  updatePostRating(postId: string, rating: number): Observable<PostDetail>;
}