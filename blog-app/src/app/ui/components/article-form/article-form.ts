import { Component, Output, EventEmitter, computed, input, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Article } from '../../../models/article';

interface MinLengthValidationInfo {
  requiredLength: number;
  actualLength: number;
}

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss'
})
export class ArticleForm {
  editArticle = input<Article | null>(null);

  @Output() submitArticle = new EventEmitter<{ article: Article; file?: File }>();
  @Output() cancel = new EventEmitter<void>();

  protected isEditMode = computed<boolean>(() => Boolean(this.editArticle()));
  protected formTitle = computed(() => this.editArticle() ? 'Изменить статью' : 'Добавить статью');
  protected saveButtonTitle = computed(() => this.editArticle() ? 'Сохранить' : 'Добавить');
  protected selectedFile: File | null = null;

  protected form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(25)]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('')
  });

  constructor() {
    effect(() => {
      const article = this.editArticle();
      if (article) {
        this.form.patchValue({
          title: article.title,
          description: article.description,
          category: article.category
        });
      } else {
        this.form.reset();
        this.selectedFile = null;
      }
    });
  }

  protected onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid && control.touched);
  }

  protected getControlErrors(controlName: string): string[] {
    const control = this.form.get(controlName);
    const errors = control?.errors ?? null;
    if (errors) {
      return Object.entries(errors).map(([key, value]) => this.getErrorStr(key, value));
    }
    return [];
  }

  private getErrorStr(errorCode: string, errorData: unknown): string {
    switch (errorCode) {
      case 'required':
        return 'Поле обязательно для заполнения';
      case 'minlength':
        const { requiredLength, actualLength } = errorData as MinLengthValidationInfo;
        return `Нужно ещё ${requiredLength - actualLength} символов`;
      default:
        return 'Ошибка при заполнении поля';
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitArticle.emit({
      article: {
        id: this.editArticle()?.id || '',
        title: this.form.value.title!,
        description: this.form.value.description!,
        category: this.form.value.category || '',
        image: this.editArticle()?.image || 'images/paris.png',
        imageAlt: this.form.value.title!
      },
      file: this.selectedFile ?? undefined
    });
    this.form.reset();
    this.selectedFile = null;
  }
}