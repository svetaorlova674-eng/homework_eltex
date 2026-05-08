import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { POST_SERVICE_TOKEN } from '../../../services/post/post-service.token';
import { PostStoreService } from '../../../services/post/post-store.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post-page',
  imports: [FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss'
})
export class PostPage implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(POST_SERVICE_TOKEN);
  private store = inject(PostStoreService);
  private titleService = inject(Title);

  post = this.store.post;
  authorName = signal('');
  commentText = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPost(id).subscribe(post => {
      this.store.savePost(post);
      this.titleService.setTitle(post.title);
    });
  }

  updatePostRating(rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updatePostRating(post.id, rating).subscribe(updated => {
      this.store.savePost(updated);
    });
  }

  updateCommentRating(commentId: number, rating: number) {
    const post = this.post();
    if (!post) return;
    this.postService.updateCommentRating(post.id, commentId, rating).subscribe(updated => {
      this.store.savePost(updated);
    });
  }

  addComment() {
    const post = this.post();
    if (!post || !this.authorName() || !this.commentText()) return;
    this.postService.addComment(post.id, {
      author: this.authorName(),
      text: this.commentText(),
      rating: 0
    }).subscribe(updated => {
      this.store.savePost(updated);
      this.authorName.set('');
      this.commentText.set('');
    });
  }
}