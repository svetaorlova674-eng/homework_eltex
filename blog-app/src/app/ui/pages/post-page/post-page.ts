import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { POST_SERVICE_TOKEN } from '../../../services/post/post-service.token';
import { PostStoreService } from '../../../services/post/post-store.service';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { StarRating } from '../../components/star-rating/star-rating';
import { CommentForm } from '../../components/comment-form/comment-form';
import { WebSocketService } from '../../../services/websocket/websocket.service';
import { WsMessage, WsArticleRatingPayload, WsCommentRatingPayload, WsCommentCreatedPayload } from '../../../services/websocket/websocket.types';
import { Comment } from '../../../services/post/types/comment';

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
  private destroyRef = inject(DestroyRef);
  private articleId = '';

  protected post = this.store.post;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.articleId = id;

    this.postService.getPost(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(post => {
        this.store.savePost(post);
        this.titleService.setTitle(post.title);
      });

    this.wsService.connect();
    this.wsService.subscribeToArticle(id);
    this.listenToWebSocket();
  }

  ngOnDestroy() {
    this.wsService.unsubscribeFromArticle(this.articleId);
    this.wsService.disconnect();
  }

  private listenToWebSocket() {
    this.wsService.getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(msg => this.handleWsMessage(msg));
  }

  private handleWsMessage(msg: WsMessage) {
    const post = this.store.post();
    if (!post) return;

    switch (msg.type) {
      case 'ARTICLE_RATING_CHANGED': {
        const payload = msg.payload as WsArticleRatingPayload;
        if (payload.articleId === this.articleId) {
          this.store.savePost({ ...post, rating: payload.rating });
        }
        break;
      }
      case 'COMMENT_RATING_CHANGED': {
        const payload = msg.payload as WsCommentRatingPayload;
        const updatedComments = post.comments.map(c =>
          c.id === payload.commentId ? { ...c, rating: payload.rating } : c
        );
        this.store.savePost({ ...post, comments: updatedComments });
        break;
      }
      case 'COMMENT_CREATED': {
        const payload = msg.payload as WsCommentCreatedPayload;
        if (payload.articleId === this.articleId) {
          const newComment: Comment = {
            id: payload.commentId,
            author: payload.username,
            text: payload.content,
            rating: 0,
            date: new Date(payload.createdAt).toLocaleDateString()
          };
          this.store.savePost({ ...post, comments: [...post.comments, newComment] });
        }
        break;
      }
    }
  }

  protected updatePostRating(rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updatePostRating(post.id, rating)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updated => {
        this.store.savePost({ ...post, rating: updated.rating });
      });
  }

  protected updateCommentRating(commentId: string, rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updateCommentRating(post.id, commentId, rating)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updated => {
        const updatedComments = post.comments.map(c =>
          c.id === commentId ? { ...c, rating: updated.rating } : c
        );
        this.store.savePost({ ...post, comments: updatedComments });
      });
  }

  protected addComment(data: { author: string; text: string }) {
    const post = this.post();
    if (!post) return;
    this.postService.addComment(post.id, { ...data, rating: 0 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newComment => {
        this.store.savePost({
          ...post,
          comments: [...post.comments, newComment as unknown as Comment]
        });
      });
  }
}