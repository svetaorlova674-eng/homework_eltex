import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-article-card',
  imports: [],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss'
})
export class ArticleCard {
  @Input() article!: Article;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Article>();

  onDelete() {
    this.delete.emit(this.article.id);
  }

  onEdit() {
    this.edit.emit(this.article);
  }
}