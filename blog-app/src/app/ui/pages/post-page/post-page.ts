import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { POST_SERVICE_TOKEN } from '../../../services/post/post-service.token';
import { PostStoreService } from '../../../services/post/post-store.service';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { StarRating } from '../../components/star-rating/star-rating';
import { CommentForm } from '../../components/comment-form/comment-form';

@Component({
  selector: 'app-post-page',
  imports: [MatCardModule, StarRating, CommentForm],
  providers: [PostStoreService],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss'
})
export class PostPage implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(POST_SERVICE_TOKEN);
  private store = inject(PostStoreService);
  private titleService = inject(Title);

  protected post = this.store.post;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPost(id).subscribe(post => {
      this.store.savePost(post);
      this.titleService.setTitle(post.title);
    });
  }

  protected updatePostRating(rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updatePostRating(post.id, rating).subscribe(updated => {
      this.store.savePost(updated);
    });
  }

  protected updateCommentRating(commentId: number, rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updateCommentRating(post.id, commentId, rating).subscribe(updated => {
      this.store.savePost(updated);
    });
  }

  protected addComment(data: { author: string; text: string }) {
    const post = this.post();
    if (!post) return;
    this.postService.addComment(post.id, { ...data, rating: 0 }).subscribe(updated => {
      this.store.savePost(updated);
    });
  }
}