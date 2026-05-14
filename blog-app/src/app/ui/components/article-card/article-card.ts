import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../../models/article';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss'
})
export class ArticleCard {
  @Input() article!: Article;
  @Input() isEditing: boolean = false;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Article>();

  onDelete() {
    this.delete.emit(this.article.id);
  }

  onEdit() {
    this.edit.emit(this.article);
  }
}