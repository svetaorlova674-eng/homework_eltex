import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-form',
  imports: [FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss' 
})
export class CommentForm {
  @Output() submitted = new EventEmitter<{ author: string; text: string }>();

  protected authorName = '';
  protected commentText = '';

  protected onSubmit() {
    if (!this.authorName || !this.commentText) return;
    this.submitted.emit({ author: this.authorName, text: this.commentText });
    this.authorName = '';
    this.commentText = '';
  }
}