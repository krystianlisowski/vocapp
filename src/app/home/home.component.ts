import { Component, DestroyRef, inject } from '@angular/core';
import { LessonListComponent } from './ui/lesson-list/lesson-list.component';
import { LessonsService } from '../shared/data-access/lessons.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLessonDialogComponent } from './ui/add-lesson-dialog/add-lesson-dialog.component';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header class="d-flex justify-content-between my-4">
      <h1 translate="home.heading"></h1>
      <button mat-raised-button color="primary" (click)="openDialog()">
        {{ 'home.addLesson' | translate }}
      </button>
    </header>

    <body>
      <app-lesson-list [lessons]="lessonService.lessons"></app-lesson-list>
    </body>
  `,
  styles: ``,
  imports: [LessonListComponent, MatButtonModule, TranslateModule],
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
