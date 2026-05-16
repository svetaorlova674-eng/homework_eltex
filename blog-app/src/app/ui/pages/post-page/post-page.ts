import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { POST_SERVICE_TOKEN } from '../../../services/post/post-service.token';
import { PostStoreService } from '../../../services/post/post-store.service';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { StarRating } from '../../components/star-rating/star-rating';
import { CommentForm } from '../../components/comment-form/comment-form';
import { WebSocketService } from '../../../services/websocket/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-page',
  imports: [MatCardModule, StarRating, CommentForm],
  providers: [PostStoreService],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss'
})
export class PostPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private postService = inject(POST_SERVICE_TOKEN);
  private store = inject(PostStoreService);
  private titleService = inject(Title);
  private wsService = inject(WebSocketService);
  private wsSub: Subscription | null = null;
  private articleId = '';

  protected post = this.store.post;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.articleId = id;

    this.postService.getPost(id).subscribe(post => {
      this.store.savePost(post);
      this.titleService.setTitle(post.title);
    });

    this.wsService.connect();
    this.wsService.subscribeToArticle(id);

    this.wsSub = this.wsService.getMessages().subscribe(msg => {
      const post = this.store.post();
      if (!post) return;

      if (msg.type === 'ARTICLE_RATING_CHANGED' && msg.payload.articleId === this.articleId) {
        this.store.savePost({ ...post, rating: msg.payload.rating });
      }

      if (msg.type === 'COMMENT_RATING_CHANGED') {
        const updatedComments = post.comments.map(c =>
          c.id === msg.payload.commentId
            ? { ...c, rating: msg.payload.rating }
            : c
        );
        this.store.savePost({ ...post, comments: updatedComments });
      }

      if (msg.type === 'COMMENT_CREATED' && msg.payload.articleId === this.articleId) {
        const newComment: any = {
          id: msg.payload.commentId,
          author: msg.payload.username,
          text: msg.payload.content,
          rating: 0,
          date: new Date(msg.payload.createdAt).toLocaleDateString()
        };
        this.store.savePost({ ...post, comments: [...post.comments, newComment] });
      }
    });
  }

  ngOnDestroy() {
    this.wsService.unsubscribeFromArticle(this.articleId);
    this.wsService.disconnect();
    this.wsSub?.unsubscribe();
  }

  protected updatePostRating(rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updatePostRating(post.id, rating).subscribe(updated => {
      this.store.savePost({ ...post, rating: updated.rating });
    });
  }

  protected updateCommentRating(commentId: string, rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updateCommentRating(post.id, commentId, rating).subscribe(updated => {
      const updatedComments = post.comments.map(c =>
        c.id === commentId ? { ...c, rating: updated.rating } : c
      );
      this.store.savePost({ ...post, comments: updatedComments });
    });
  }

  protected addComment(data: { author: string; text: string }) {
    const post = this.post();
    if (!post) return;
    this.postService.addComment(post.id, { ...data, rating: 0 }).subscribe(newComment => {
      this.store.savePost({
        ...post,
        comments: [...post.comments, newComment as unknown as any]
      });
    });
  }
}