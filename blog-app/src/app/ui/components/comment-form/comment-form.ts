import { Component, Output, EventEmitter, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AUTH_SERVICE_TOKEN } from '../../../services/auth/auth-service.token';

@Component({
  selector: 'app-comment-form',
  imports: [FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss'
})
export class CommentForm {
  private authService = inject(AUTH_SERVICE_TOKEN);

  @Output() submitted = new EventEmitter<{ author: string; text: string }>();

  protected user = this.authService.getUser();
  protected isLoggedIn = computed(() => this.user() !== null);
  protected authorName = '';
  protected commentText = '';

  protected onSubmit() {
    const author = this.user()?.username || this.authorName;
    if (!author || !this.commentText) return;
    this.submitted.emit({ author, text: this.commentText });
    this.authorName = '';
    this.commentText = '';
  }
}