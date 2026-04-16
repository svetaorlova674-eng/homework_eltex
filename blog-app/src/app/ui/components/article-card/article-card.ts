import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../pages/main-page/main-page';

@Component({
  selector: 'app-article-card',
  imports: [],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss'
})
export class ArticleCard {
  @Input() article!: Article;
  @Input() index: number = 0;
  @Output() delete = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.article.id);
  }
}