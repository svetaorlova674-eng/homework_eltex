import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-star-rating',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './star-rating.html'
})
export class StarRating {
  @Input() rating = 0;
  @Output() ratingChange = new EventEmitter<number>();

  protected stars = [1, 2, 3, 4, 5];

  protected onStarClick(star: number) {
    this.ratingChange.emit(star);
  }
}