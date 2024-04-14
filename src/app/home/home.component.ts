import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { LessonListComponent } from './ui/lesson-list/lesson-list.component';
import { LessonsService } from './data-acess/lessons.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLessonDialogComponent } from './ui/add-lesson-dialog/add-lesson-dialog.component';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
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
    <header>
      <div class="lg:flex lg:items-center lg:justify-between my-6">
        <div class="min-w-0 flex-1">
          <h1
            translate="home.heading"
            class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
          ></h1>
        </div>
        @if(authService.user()?.emailVerified) {
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="block">
            <button mat-raised-button color="primary" (click)="openAddDialog()">
              {{ 'home.addLesson' | translate }}
            </button>
          </span>
        </div>
        }
      </div>
    </header>

    <main>
      <app-lesson-list
        [lessons]="lessonService.lessons()"
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
  private router = inject(Router);
  authService = inject(AuthService);
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
