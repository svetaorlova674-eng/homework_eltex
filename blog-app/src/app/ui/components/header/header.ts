import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AUTH_SERVICE_TOKEN } from '../../../services/auth/auth-service.token';
import { AuthDialog } from '../auth-dialog/auth-dialog';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private authService = inject(AUTH_SERVICE_TOKEN);
  private dialog = inject(MatDialog);

  protected user = this.authService.getUser();
  protected isLoggedIn = computed(() => this.user() !== null);

  scrollToContacts() {
    const el = document.getElementById('contacts');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  protected openAuthDialog() {
    this.dialog.open(AuthDialog, {
      width: '460px',
      panelClass: 'auth-dialog-panel'
    });
  }

  protected logout() {
    this.authService.logout();
  }
}