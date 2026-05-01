import { Component } from '@angular/core';

@Component({
  selector: 'app-hobby',
  imports: [],
  templateUrl: './hobby.html',
  styleUrl: './hobby.scss'
})
export class Hobby {
  hobbyItems = [
    { image: 'images/mock img 2.png', alt: 'Девушка', boxClass: 'box_1' },
    { image: 'images/mock img 1.png', alt: 'Композиция', boxClass: 'box_2' },
    { image: 'images/hobby 3.jpg', alt: 'Гончарное дело', boxClass: 'box_3' },
    { image: 'images/hobby 4.jpg', alt: 'Рисование', boxClass: 'box_4' }
  ];
}