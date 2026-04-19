import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-article-form',
  imports: [FormsModule],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss'
})
export class ArticleForm {
  @Output() submitArticle = new EventEmitter<Article>();
  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';

  onSubmit() {
    if (!this.title || !this.description) return;
    this.submitArticle.emit({
      id: 0,
      title: this.title,
      description: this.description,
      category: '',
      image: 'images/paris.png',
      imageAlt: this.title
    });
    this.title = '';
    this.description = '';
  }
}