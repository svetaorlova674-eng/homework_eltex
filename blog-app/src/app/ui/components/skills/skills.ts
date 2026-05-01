import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {
  skillGroups = [
    ['Photography', 'Brand Identity'],
    ['Graphic Design', 'Copy Writing'],
    ['Creativity', 'Team Working']
  ];
}