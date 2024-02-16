import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../shared/data-access/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { LessonService } from './data-acess/lesson.service';
import { FirebaseToDatePipe } from '../shared/pipes/firebase-to-date.pipe';
import { VocabularyItemComponent } from './ui/vocabulary-item/vocabulary-item.component';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddVocabularyDialogComponent } from './ui/add-vocabulary-dialog/add-vocabulary-dialog.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { Vocabulary } from '../shared/models/vocabulary.model';
import { EditVocabularyDialogComponent } from './ui/edit-vocabulary-dialog/edit-vocabulary-dialog.component';
import { EmptyListComponent } from '../shared/ui/empty-list/empty-list.component';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    FirebaseToDatePipe,
    VocabularyItemComponent,
    MatGridList,
    MatGridTile,
    EmptyListComponent,
  ],
  template: `
    <header class="d-flex justify-content-between my-4">
      <div>
        <h2>{{ lessonService.lesson()?.title }}</h2>
        <span> {{ lessonService.lesson()?.date | firebaseToDate }}</span>
      </div>
      <div>
        @if(authService.user()?.emailVerified) {
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          {{ 'vocabulary.addNew' | translate }}
        </button>
        }
      </div>
    </header>

    <main>
      <div class="row">
        @for (item of lessonService.vocabulary(); track $index) {
        <app-vocabulary-item
          [item]="item"
          (itemDeleted)="openDeleteDialog($event)"
          (itemEdited)="openEditDialog($event)"
        ></app-vocabulary-item>
        } @empty {
        <app-empty-list></app-empty-list>
        }
      </div>
    </main>
  `,
  styles: ``,
})
export class LessonComponent implements OnInit {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  authService = inject(AuthService);
  lessonService = inject(LessonService);
  @Input() id!: string;

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnInit(): void {
    this.lessonService.initializeState(this.id);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddVocabularyDialogComponent);
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

  openEditDialog(phrase: Vocabulary) {
    const dialogRef = this.dialog.open(EditVocabularyDialogComponent, {
      data: { phrase },
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => this.lessonService.edit$.next({ ...phrase, ...res }));
  }
}
