import { Component, ViewChild, ElementRef, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Article } from '../../../models/article';
import { ArticleCard } from '../../components/article-card/article-card';
import { ArticleForm } from '../../components/article-form/article-form';
import { ARTICLES_SERVICE_TOKEN } from '../../../services/articles/articles-service.token';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
const PAGE_SIZE = 7;

@Component({
  selector: 'app-blog-page',
  imports: [ArticleCard, ArticleForm],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogPage implements OnInit {
  @ViewChild('statsDialog') statsDialog!: ElementRef<HTMLDialogElement>;

  private articlesService = inject(ARTICLES_SERVICE_TOKEN);
  private store = inject(ArticlesStoreService);

  showForm = false;
  isLoading = true;
  editingArticle: Article | null = null;

  get articles() { return this.store.articles(); }
  get currentPage() { return this.store.currentPage(); }
  get total() { return this.store.total(); }
  get totalPages() { return Math.ceil(this.total / PAGE_SIZE); }

  ngOnInit() {
    this.loadArticles(this.currentPage);
  }

  private loadArticles(page: number) {
    this.isLoading = true;
    setTimeout(() => {
      this.articlesService.getArticles(page, PAGE_SIZE).subscribe(response => {
        this.store.saveArticles(response.articles);
        this.store.saveTotal(response.total);
        this.store.savePage(page);
        this.isLoading = false;
      });
    }, 1500);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadArticles(page);
  }

  get pages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

  deleteArticle(id: number) {
    this.articlesService.deleteArticle(id).subscribe(response => {
      this.store.saveArticles(response.articles);
      this.store.saveTotal(response.total);
      if (this.editingArticle?.id === id) {
        this.editingArticle = null;
        this.showForm = false;
      }
    });
  }

  onEditArticle(article: Article) {
    this.editingArticle = article;
    this.showForm = true;
  }

  saveArticle(article: Article) {
    if (this.editingArticle) {
      this.articlesService.updateArticle(article).subscribe(response => {
        this.store.saveArticles(response.articles);
        this.store.saveTotal(response.total);
      });
    } else {
      this.articlesService.addArticle(article).subscribe(response => {
        this.store.saveArticles(response.articles);
        this.store.saveTotal(response.total);
        this.store.savePage(this.totalPages);
      });
    }
    this.showForm = false;
    this.editingArticle = null;
  }

  onCancelForm() {
    this.showForm = false;
    this.editingArticle = null;
  }

  onToggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.editingArticle = null;
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