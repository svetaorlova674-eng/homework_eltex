import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleCard } from '../../components/article-card/article-card';
import { Hero } from '../../components/hero/hero';
import { Skills } from '../../components/skills/skills';
import { Work } from '../../components/work/work';
import { Hobby } from '../../components/hobby/hobby';
import { ARTICLES_SERVICE_TOKEN } from '../../../services/articles/articles-service.token';
import { Article } from '../../../models/article';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  imports: [ArticleCard, RouterLink, Hero, Skills, Work, Hobby],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage implements OnInit {
  private articlesService = inject(ARTICLES_SERVICE_TOKEN);
  private titleService = inject(Title);
  latestArticles: Article[] = [];

  ngOnInit() {
    this.titleService.setTitle('Главная');
    this.articlesService.getArticles(1, 1000).subscribe(response => {
      this.latestArticles = response.articles.slice(-2);
    });
  }

  deleteArticle(id: string) {
    this.articlesService.deleteArticle(id).subscribe(response => {
      this.latestArticles = response.articles.slice(-2);
    });
  }
}