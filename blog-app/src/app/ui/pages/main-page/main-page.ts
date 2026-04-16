import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleCard } from '../../components/article-card/article-card';

export interface Article {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

@Component({
  selector: 'app-main-page',
  imports: [ArticleCard, RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage {
  articles: Article[] = [
    {
      id: 1,
      category: 'Product photography',
      title: 'Paris secrets',
      description: 'Sint occaecat deserunt aliquip do occaecat ut quis. Cupidatat magna fugiat quis sit duis est in volup',
      image: 'images/paris.png',
      imageAlt: 'Вид на Эйфелеву башню'
    },
    {
      id: 2,
      category: 'Portrait',
      title: 'Oceanic feeling',
      description: 'Sint occaecat deserunt aliquip do occaecat ut quis. Cupidatat magna fugiat quis sit duis est in volup',
      image: 'images/ocean.png',
      imageAlt: 'Горы в тумане рядом с океаном'
    }
  ];
    deleteArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
    }
}

