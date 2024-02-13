import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switch',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
  template: `<button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>language</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      @for (item of languages(); track $index) {
      <button
        mat-menu-item
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

  onLangChange(lang: string) {
    this.translateService.use(lang);
  }

  ngOnInit(): void {
    this.translateService.use(this.translateService.defaultLang);
  }
}
