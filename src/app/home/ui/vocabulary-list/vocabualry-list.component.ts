import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { DatatableComponent } from '../../../shared/ui/datatable/datatable.component';
import { DatatableManager } from '../../../shared/ui/datatable/datatable';
import dayjs from 'dayjs';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CanWritePipe } from '../../../shared/pipes/can-write.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { VocabularyListItem } from '../../../shared/models/vocabulary.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-vocabulary-list',
  standalone: true,
  imports: [
    NgClass,
    TranslateModule,
    DatatableComponent,
    RouterLink,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
    MatTooltip,
    CanWritePipe,
  ],
  template: `
    <app-datatable [datatable]="datatable()!"></app-datatable>
    <ng-template #linkCol let-item="item">
      @if(item | canWrite) {
      <button
        mat-icon-button
        color="warn"
        [matTooltip]="'tooltip.delete' | translate"
        data-testid="delete-vocabulary-button"
        (click)="vocabularyDeleted.emit(item.id)"
      >
        <mat-icon>delete</mat-icon>
      </button>
      }

      <a mat-icon-button [routerLink]="[item.id]">
        <mat-icon>arrow_forward_ios</mat-icon>
      </a>
    </ng-template>

    <ng-template #phraseCol let-item="item">
      <span [ngClass]="{ 'text-green-600 font-semibold': item.important }">
        {{ item.title }}
      </span>
    </ng-template>

    <ng-template #typeCol let-item="item">
      <span>
        {{ 'vocabulary.type.' + item.type | translate }}
      </span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabularyListComponent implements OnInit {
  vocabulary = input.required<VocabularyListItem[]>();
  @ViewChild('linkCol', { static: true }) linkCol!: TemplateRef<any>;
  @ViewChild('phraseCol', { static: true }) nameCol!: TemplateRef<any>;
  @ViewChild('typeCol', { static: true }) typeCol!: TemplateRef<any>;
  @Output() vocabularyDeleted = new EventEmitter<string>();

  datatable = signal<DatatableManager<VocabularyListItem> | null>(null);

  ngOnInit(): void {
    this.datatable.set(this.datatableManagerFactory());
  }

  datatableManagerFactory(): DatatableManager<VocabularyListItem> {
    return new DatatableManager({
      rows: this.vocabulary,
      visibleCols: [
        {
          key: 'title',
          header: 'vocabulary.title',
          template: this.nameCol,
        },
        {
          key: 'type',
          header: 'vocabulary.typeOfSpeech',
          template: this.typeCol,
        },
        {
          key: 'lessonDate',
          header: 'vocabulary.lessonDate',
          formatter: (item) =>
            dayjs(item.lessonDate.toDate()).format('DD/MM/YYYY'),
        },
        {
          key: 'details',
          header: 'vocabulary.details',
          template: this.linkCol,
        },
      ],
    });
  }
}