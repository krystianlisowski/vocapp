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
    MatTooltip,
    MatButton,
  ],
  template: `
    <nav class="bg-zinc-900">
      <div class="container">
        <div class="relative flex h-16 items-center justify-between">
          <div
            class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
          >
            <div class="flex flex-shrink-0 items-center">
              <a
                data-testid="logo"
                routerLink="/"
                class="flex items-center text-zinc-100 "
              >
                <mat-icon class="mr-2">menu_book</mat-icon>
                <span class="text-xl">Vocapp</span>
              </a>
            </div>
          </div>
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
          >
            @if (authService.user()) {
            <button
              data-testid="user-button"
              mat-icon-button
              [matMenuTriggerFor]="menu"
              [matTooltip]="authService.user()?.email"
              aria-label="Example icon-button with menu icon"
            >
              <mat-icon class="text-zinc-100">person</mat-icon>
            </button>
            <mat-menu #menu="matMenu" data-testid="action-list">
              <button
                mat-menu-item
                (click)="authService.logout()"
                data-testid="action-button"
              >
                <mat-icon>logout</mat-icon>
                <span translate="header.logout"></span>
              </button>
            </mat-menu>
            }
            <app-language-switch></app-language-switch>
          </div>
        </div>
      </div>
    </nav>

    @if (authService.user() && !authService.user()?.emailVerified) {

    <div
      data-testid="verification-banner"
      class="relative isolate flex items-center gap-x-6 overflow-hidden bg-zinc-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
    >
      <div class="container">
        <div
          class="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          aria-hidden="true"
        >
          <div
            class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#059669] to-[#fdba74] opacity-30"
            style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
          ></div>
        </div>
        <div
          class="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          aria-hidden="true"
        >
          <div
            class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#059669] to-[#fdba74] opacity-30"
            style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
          ></div>
        </div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p class="text-sm leading-6 text-zinc-900">
            <span translate="header.alert"></span>
          </p>
          @if(authService.verificationEmailSent()) {
          <mat-icon
            data-testid="send-success-icon"
            class="text-emerald-600"
            [matTooltip]="'header.emailWasSent' | translate"
            >done</mat-icon
          >
          }
          <button
            mat-button
            data-testid="send-link-button"
            translate="header.sendMeLink"
            [disabled]="authService.verificationEmailSent()"
            (click)="authService.emailVerification$.next()"
          ></button>
        </div>
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
