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
  ],
  template: `
    <header class="d-flex justify-content-between my-4">
      <div>
        <h2>{{ lessonService.lesson()?.title }}</h2>
        <span> {{ lessonService.lesson()?.date | firebaseToDate }}</span>
      </div>
      <div>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          {{ 'vocabulary.addNew' | translate }}
        </button>
      </div>
    </header>

    <main>
      <mat-grid-list cols="2" rowHeight="2:1" gutterSize="20">
        @for (item of lessonService.vocabulary(); track $index) {
        <mat-grid-tile>
          <app-vocabulary-item [item]="item"></app-vocabulary-item>
        </mat-grid-tile>

        }
      </mat-grid-list>
    </main>
  `,
  styles: ``,
})
export class LessonComponent implements OnInit {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);
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
}
