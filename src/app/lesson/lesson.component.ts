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
import { VocabularyDetailsService } from './data-acess/vocabulary-details.service';
import { FirebaseToDatePipe } from '../shared/pipes/firebase-to-date.pipe';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { Vocabulary } from '../shared/models/vocabulary.model';
import { EditVocabularyDialogComponent } from './ui/edit-vocabulary-dialog/edit-vocabulary-dialog.component';
import { EmptyListComponent } from '../shared/ui/empty-list/empty-list.component';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [TranslateModule, MatButton, FirebaseToDatePipe, EmptyListComponent],
  template: `
    <header class="mt-10">
      <div class="lg:flex lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2
            class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
          >
            {{ detailsService.vocabulary()?.title }}
          </h2>
          <div class="mt-1 flex sm:mt-0 sm:flex-row sm:flex-wrap space-x-6">
            <div
              class="mt-2 flex items-center text-sm text-gray-500"
              data-testid="lesson-date"
            >
              <svg
                class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ detailsService.vocabulary()?.lessonDate | firebaseToDate }}
            </div>

            @if (detailsService.vocabulary()?.important) {
            <div
              class="mt-2 flex items-center text-sm text-gray-500"
              data-testid="important-badge"
            >
              <span
                class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                >{{ 'vocabulary.important' | translate }}</span
              >
            </div>
            }

            <div
              class="mt-2 flex items-center text-sm text-gray-500"
              data-testid="type-badge"
            >
              <span
                class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              >
                {{
                  'vocabulary.type.' + detailsService.vocabulary()?.type
                    | translate
                }}</span
              >
            </div>
          </div>
        </div>

        @if(authService.user()?.emailVerified) {
        <div class="flex mt-4 lg:mt-0">
          <span class="sm:ml-3">
            <button
              mat-raised-button
              color="primary"
              data-testid="edit-button"
              (click)="openEditDialog(detailsService.vocabulary()!)"
            >
              {{ 'vocabulary.edit' | translate }}
            </button>
          </span>

          <span class="ml-3">
            <button
              mat-raised-button
              data-testid="delete-button"
              color="warn"
              (click)="openDeleteDialog(id)"
            >
              {{ 'vocabulary.delete' | translate }}
            </button>
          </span>
        </div>
        }
      </div>
    </header>

    <main>
      @if (detailsService.vocabulary()?.translation) {
      <div class="my-10" data-testid="translation">
        <h3
          class="text-lg font-semibold leading-7 text-gray-900"
          translate="vocabulary.translation"
        ></h3>
        <p class="mt-1 text-base leading-6 text-gray-600">
          {{ detailsService.vocabulary()?.translation }}
        </p>
      </div>
      } @if (detailsService.vocabulary()?.definitions?.length) {
      <div class="my-10" data-testid="definitions">
        <h3
          class="text-lg font-semibold leading-7 text-gray-900"
          translate="vocabulary.definitions"
        ></h3>

        <ul role="list" class="list-disc space-y-2 pl-4 text-sm mt-1">
          @for (item of detailsService.vocabulary()?.definitions; track $index)
          {
          <li class="text-gray-400 text-base">
            <span class="text-gray-600"> {{ item }} </span>
          </li>
          }
        </ul>
      </div>
      } @if (detailsService.vocabulary()?.examples?.length) {
      <div class="my-10" data-testid="examples">
        <h3
          class="text-lg font-semibold leading-7 text-gray-900"
          translate="vocabulary.examples"
        ></h3>

        <ul role="list" class="list-disc space-y-2 pl-4 text-sm mt-1">
          @for (item of detailsService.vocabulary()?.examples; track $index) {
          <li class="text-gray-400 text-base">
            <span class="text-gray-600"> {{ item }} </span>
          </li>
          }
        </ul>
      </div>
      } @if (detailsService.vocabulary()?.links?.length) {
      <div class="my-10" data-testid="links">
        <h3
          class="text-lg font-semibold leading-7 text-gray-900"
          translate="vocabulary.links"
        ></h3>

        <ul role="list" class="list-disc space-y-2 pl-4 text-sm mt-1">
          @for (item of detailsService.vocabulary()?.links; track $index) {
          <li class="text-gray-400 text-base">
            <a
              [href]="item.link"
              target="_blank"
              class="font-medium text-indigo-700 hover:text-indigo-500"
            >
              {{ item.title }}</a
            >
          </li>
          }
        </ul>
      </div>
      }
    </main>
  `,
})
export class LessonComponent implements OnInit {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  authService = inject(AuthService);
  detailsService = inject(VocabularyDetailsService);
  @Input() id!: string;

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnInit(): void {
    this.detailsService.initializeState(this.id);
  }

  openDeleteDialog(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.detailsService.remove$.next(id));
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
      .subscribe((res) =>
        this.detailsService.edit$.next({ ...phrase, ...res })
      );
  }
}
