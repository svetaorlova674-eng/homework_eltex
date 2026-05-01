import { Component } from '@angular/core';

@Component({
  selector: 'app-work',
  imports: [],
  templateUrl: './work.html',
  styleUrl: './work.scss'
})
export class Work {
  workItems = [
    {
      logo: 'images/Consectetur.svg',
      company: 'Consectetur',
      period: '2016 - 2017',
      role: 'Graphic design',
      description: 'Nostrud tempor cillum sunt excepteur do ut proident deserunt enim consequat exercitatio'
    },
    {
      logo: 'images/Bibendum.svg',
      company: 'Bibendum',
      period: '2017 - 2020',
      role: 'Photographer',
      description: 'Ad do dolore cillum dolor et ex non dolor qui. Dolor amet tempor pariatur officia pariatur et'
    },
    {
      logo: 'images/Adipiscing.svg',
      company: 'Adipiscing',
      period: '2020 - 2022',
      role: "Photographer's Assistant",
      description: 'Ad do dolore cillum dolor et ex non dolor qui. Dolor amet tempor pariatur officia pariatur et'
    }
  ];
}