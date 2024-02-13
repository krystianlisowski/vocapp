import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { LanguageSwitchComponent } from '../language-switch/language-switch.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../data-access/auth.service';
import { MatCard, MatCardContent } from '@angular/material/card';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    LanguageSwitchComponent,
    TranslateModule,
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenuItem,
    MatMenu,
    MatCard,
    MatCardContent,
    MatTooltip,
  ],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" class="logo">
        <mat-icon class="mr-2">menu_book</mat-icon>
        <span>Vocapp</span>
      </a>

      <span class="spacer"></span>

      @if (authService.user()) {
      <button
        mat-icon-button
        [matMenuTriggerFor]="menu"
        [matTooltip]="authService.user()?.email"
        aria-label="Example icon-button with menu icon"
      >
        <mat-icon>person</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
          <span translate="header.logout"></span>
        </button>
      </mat-menu>
      }

      <app-language-switch></app-language-switch>
    </mat-toolbar>
  `,
  styles: `
    .spacer {
      flex: 1 1 auto;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #FFF;
    }

    span {
      font-size: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
