import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
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
    MatButton,
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

    @if (authService.user() && !authService.user()?.emailVerified) {
    <div class="container">
      <mat-card>
        <mat-card-content>
          <div class="d-flex align-items-center justify-content-between">
            <span translate="header.alert"></span>

            <div class="d-flex align-items-center">
              @if(authService.verificationEmailSent()) {
              <mat-icon
                color="accent"
                [matTooltip]="'header.emailWasSent' | translate"
                >done</mat-icon
              >
              }
              <button
                mat-button
                translate="header.sendMeLink"
                [disabled]="authService.verificationEmailSent()"
                (click)="authService.emailVerification$.next()"
              ></button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    }
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
      font-size: 1rem;
    }

     mat-card {
      mat-card-content {
        padding: 0.25rem 1rem;
      }
      
      span {
        color:red;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
