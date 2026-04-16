import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Article } from '../main-page/main-page';
import { ArticleCard } from '../../components/article-card/article-card';
import { ArticleForm } from '../../components/article-form/article-form';

@Component({
  selector: 'app-blog-page',
  imports: [ArticleCard, ArticleForm],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class BlogPage implements OnInit {
  @ViewChild('statsDialog') statsDialog!: ElementRef<HTMLDialogElement>;

  showForm = false;
  isLoading = true;
  articles: Article[] = [];

  private allArticles: Article[] = [
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.articles = this.allArticles;
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 1500);
  }

  deleteArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
  }

  addArticle(article: Article) {
    this.articles.push({ ...article, id: Date.now() });
    this.showForm = false;
  }

  openStats() {
    this.statsDialog.nativeElement.showModal();
  }

  closeStats() {
    this.statsDialog.nativeElement.close();
  }

  onDialogClick(event: MouseEvent) {
    if (event.target === this.statsDialog.nativeElement) {
      this.statsDialog.nativeElement.close();
    }
  }
}