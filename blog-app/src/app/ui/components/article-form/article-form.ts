import { Component, Output, EventEmitter, OnChanges, SimpleChanges, computed, input, inject, effect } from '@angular/core';
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

  @Output() submitArticle = new EventEmitter<Article>();
  @Output() cancel = new EventEmitter<void>();

  protected isEditMode = computed<boolean>(() => Boolean(this.editArticle()));

  protected formTitle = computed(() =>
    this.editArticle() ? 'Изменить статью' : 'Добавить статью'
  );

  protected saveButtonTitle = computed(() =>
    this.editArticle() ? 'Сохранить' : 'Добавить'
  );

  protected form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(25)]),
    description: new FormControl('', [Validators.required])
  });

  constructor() {
    effect(() => {
      const article = this.editArticle();
      if (article) {
        this.form.patchValue({
          title: article.title,
          description: article.description
        });
      } else {
        this.form.reset();
      }
    });
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid && control.touched);
  }

  protected getControlErrors(controlName: string): string[] {
    const control = this.form.get(controlName);
    const errors = control?.errors ?? null;
    if (errors) {
      return Object.entries(errors).map(([key, value]) =>
        this.getErrorStr(key, value)
      );
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
      id: this.editArticle()?.id || 0,
      title: this.form.value.title!,
      description: this.form.value.description!,
      category: this.editArticle()?.category || '',
      image: this.editArticle()?.image || 'images/paris.png',
      imageAlt: this.form.value.title!
    });
    this.form.reset();
  }
}