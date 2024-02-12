import { Component, DestroyRef, inject } from '@angular/core';
import { LessonListComponent } from './ui/lesson-list/lesson-list.component';
import { LessonsService } from '../shared/data-access/lessons.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLessonDialogComponent } from './ui/add-lesson-dialog/add-lesson-dialog.component';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1>Lessons</h1>
    <button mat-button (click)="openDialog()">Open dialog</button>
    <app-lesson-list [lessons]="lessonService.lessons()"></app-lesson-list>
  `,
  styles: ``,
  imports: [LessonListComponent],
})
export class HomeComponent {
  lessonService = inject(LessonsService);
  dialog = inject(MatDialog);
  destroyRef = inject(DestroyRef);

  openDialog() {
    const dialogRef = this.dialog.open(AddLessonDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => this.lessonService.add$.next(result));
  }
}
