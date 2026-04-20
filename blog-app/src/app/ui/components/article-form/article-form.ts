import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss'
})
export class ArticleForm implements OnInit {
  @Input() editArticle: Article | null = null;
  @Output() submitArticle = new EventEmitter<Article>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [
        this.editArticle?.title || '',
        [Validators.required, Validators.minLength(25)]
      ],
      description: [
        this.editArticle?.description || '',
        [Validators.required]
      ]
    });
  }

  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }

  get isEditMode() { return this.editArticle !== null; }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitArticle.emit({
      id: this.editArticle?.id || 0,
      title: this.form.value.title,
      description: this.form.value.description,
      category: this.editArticle?.category || '',
      image: this.editArticle?.image || 'images/paris.png',
      imageAlt: this.form.value.title
    });
    this.form.reset();
  }
}