import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { Lesson } from '../../../shared/models/lesson.model';
import { DatatableComponent } from '../../../shared/ui/datatable/datatable.component';
import { DatatableManager } from '../../../shared/ui/datatable/datatable';
import dayjs from 'dayjs';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [
    DatatableComponent,
    RouterLink,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
  ],
  template: `
    <app-datatable [datatable]="datatable"></app-datatable>
    <ng-template #linkCol let-item="item">
      <button mat-icon-button (click)="lessonEdited.emit(item)">
        <mat-icon>settings</mat-icon>
      </button>

      <button
        mat-icon-button
        color="warn"
        (click)="lessonDeleted.emit(item.id)"
      >
        <mat-icon>delete</mat-icon>
      </button>

      <a mat-icon-button [routerLink]="[item.id]">
        <mat-icon>arrow_forward_ios</mat-icon>
      </a>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonListComponent implements OnInit {
  @Input({ required: true }) lessons!: Signal<Lesson[]>;
  @ViewChild('linkCol', { static: true }) linkCol!: TemplateRef<any>;
  @Output() lessonDeleted = new EventEmitter<string>();
  @Output() lessonEdited = new EventEmitter<Lesson>();

  datatable!: DatatableManager<Lesson>;

  ngOnInit(): void {
    this.datatable = this.datatableManagerFactory();
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
