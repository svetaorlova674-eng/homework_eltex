import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AUTH_SERVICE_TOKEN } from '../services/auth/auth-service.token';
import { Observable } from 'rxjs';
import { User } from '../services/auth/auth.types';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string = '';
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AUTH_SERVICE_TOKEN);
  private user$: Observable<User | null>;
  private hasView = false;

  constructor() {
    this.user$ = toObservable(this.authService.getUser());
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      const hasAccess = this.appHasRole === 'admin'
        ? user?.role === 'admin'
        : !!user;
      if (hasAccess && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasAccess && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}