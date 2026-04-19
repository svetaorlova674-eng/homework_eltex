import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  scrollToContacts() {
    const el = document.getElementById('contacts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}