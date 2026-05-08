import { Injectable, signal } from '@angular/core';
import { PostDetail } from './types/post-detail';

@Injectable({
  providedIn: 'root'
})
export class PostStoreService {
  post = signal<PostDetail | null>(null);

  savePost(post: PostDetail): void {
    this.post.set(post);
  }

  clearPost(): void {
    this.post.set(null);
  }
}