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
import { Lesson } from '../../../shared/models/lesson.model';
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

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [
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
        (click)="lessonEdited.emit(item)"
        [matTooltip]="'tooltip.edit' | translate"
      >
        <mat-icon>settings</mat-icon>
      </button>

      <button
        mat-icon-button
        color="warn"
        [matTooltip]="'tooltip.delete' | translate"
        (click)="lessonDeleted.emit(item.id)"
      >
        <mat-icon>delete</mat-icon>
      </button>
      }

      <a mat-icon-button [routerLink]="[item.id]">
        <mat-icon>arrow_forward_ios</mat-icon>
      </a>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonListComponent implements OnInit {
  lessons = input.required<Lesson[]>();
  @ViewChild('linkCol', { static: true }) linkCol!: TemplateRef<any>;
  @Output() lessonDeleted = new EventEmitter<string>();
  @Output() lessonEdited = new EventEmitter<Lesson>();

  datatable = signal<DatatableManager<Lesson> | null>(null);

  ngOnInit(): void {
    this.datatable.set(this.datatableManagerFactory());
  }

  datatableManagerFactory(): DatatableManager<Lesson> {
    return new DatatableManager({
      rows: this.lessons,
      visibleCols: [
        {
          key: 'title',
          header: 'lesson.title',
        },
        {
          key: 'date',
          header: 'lesson.date',
          formatter: (item) => dayjs(item.date.toDate()).format('DD/MM/YYYY'),
        },
        {
          key: 'studentsCount',
          header: 'lesson.studentsCount',
        },
        {
          key: 'details',
          header: 'lesson.details',
          template: this.linkCol,
        },
      ],
    });
  }
}
