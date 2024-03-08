import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switch',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    TranslateModule,
  ],
  template: `<button
      mat-icon-button
      [matMenuTriggerFor]="menu"
      data-testid="switch-button"
    >
      <mat-icon>language</mat-icon>
    </button>
    <mat-menu #menu="matMenu" data-testid="language-list">
      @for (item of languages(); track $index) {
      <button
        mat-menu-item
        data-testid="language-option-button"
        (click)="translateService.use(item)"
        [disabled]="item === translateService.currentLang"
      >
        {{ 'header.' + item | translate }}
      </button>
      }
    </mat-menu>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchComponent implements OnInit {
  translateService = inject(TranslateService);
  languages = signal<string[]>(['en', 'pl']);

  ngOnInit(): void {
    this.translateService.use(this.translateService.defaultLang);
  }
}
