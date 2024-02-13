import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Lesson } from '../../../shared/models/lesson.model';
import { DatatableComponent } from '../../../shared/ui/datatable/datatable.component';
import { DatatableManager } from '../../../shared/ui/datatable/datatable';
import dayjs from 'dayjs';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
