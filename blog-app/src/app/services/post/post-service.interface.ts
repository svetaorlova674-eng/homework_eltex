import { Observable } from 'rxjs';
import { PostDetail } from './types/post-detail';
import { Comment } from './types/comment';

export interface IPostService {
  getPost(id: number): Observable<PostDetail>;
  addComment(postId: number, comment: Omit<Comment, 'id' | 'date'>): Observable<PostDetail>;
  updateCommentRating(postId: number, commentId: number, rating: number): Observable<PostDetail>;
  updatePostRating(postId: number, rating: number): Observable<PostDetail>;
}