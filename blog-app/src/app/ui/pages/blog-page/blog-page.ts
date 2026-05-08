import { Component, ViewChild, ElementRef, OnInit, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
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

  showForm = signal(false);
  isLoading = signal(true);
  editingArticle = signal<Article | null>(null);

  protected articles = this.store.articles;
  protected currentPage = this.store.currentPage;
  protected total = this.store.total;
  protected totalPages = computed(() => Math.ceil(this.total() / PAGE_SIZE));
  protected pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit() {
    this.loadArticles(this.currentPage());
  }

  private loadArticles(page: number) {
    this.isLoading.set(true);
    setTimeout(() => {
      this.articlesService.getArticles(page, PAGE_SIZE).subscribe(response => {
        this.store.saveArticles(response.articles);
        this.store.saveTotal(response.total);
        this.store.savePage(page);
        this.isLoading.set(false);
      });
    }, 1500);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadArticles(page);
  }

  deleteArticle(id: number) {
    this.articlesService.deleteArticle(id).subscribe(response => {
      this.store.saveArticles(response.articles);
      this.store.saveTotal(response.total);
      if (this.editingArticle()?.id === id) {
        this.editingArticle.set(null);
        this.showForm.set(false);
      }
    });
  }

  onEditArticle(article: Article) {
    this.editingArticle.set(article);
    this.showForm.set(true);
  }

  saveArticle(article: Article) {
    if (this.editingArticle()) {
      this.articlesService.updateArticle(article).subscribe(response => {
        this.store.saveArticles(response.articles);
        this.store.saveTotal(response.total);
      });
    } else {
      this.articlesService.addArticle(article).subscribe(response => {
        this.store.saveArticles(response.articles);
        this.store.saveTotal(response.total);
        this.store.savePage(this.totalPages());
      });
    }
    this.showForm.set(false);
    this.editingArticle.set(null);
  }

  onCancelForm() {
    this.showForm.set(false);
    this.editingArticle.set(null);
  }

  onToggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.editingArticle.set(null);
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