import { Component, DestroyRef, effect, inject } from '@angular/core';
import { LessonListComponent } from './ui/lesson-list/lesson-list.component';
import { LessonsService } from './data-acess/lessons.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLessonDialogComponent } from './ui/add-lesson-dialog/add-lesson-dialog.component';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/data-access/auth.service';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { Lesson } from '../shared/models/lesson.model';
import { EditLessonDialogComponent } from './ui/edit-lesson-dialog/edit-lesson-dialog.component';
@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header class="d-flex justify-content-between my-4">
      <h1 translate="home.heading"></h1>
      <button mat-raised-button color="primary" (click)="openAddDialog()">
        {{ 'home.addLesson' | translate }}
      </button>
    </header>

    <main>
      <app-lesson-list
        [lessons]="lessonService.lessons"
        (lessonDeleted)="openDeleteDialog($event)"
        (lessonEdited)="openEditDialog($event)"
      ></app-lesson-list>
    </main>
  `,
  imports: [LessonListComponent, MatButton, TranslateModule],
})
export class HomeComponent {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  lessonService = inject(LessonsService);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['login']);
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddLessonDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => this.lessonService.add$.next(result));
  }

  openDeleteDialog(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.lessonService.remove$.next(id));
  }

  openEditDialog(lesson: Lesson) {
    const dialogRef = this.dialog.open(EditLessonDialogComponent, {
      data: { lesson },
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => this.lessonService.edit$.next({ ...lesson, ...res }));
  }
}
