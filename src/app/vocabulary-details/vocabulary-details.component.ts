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
import { CanWritePipe } from '../shared/pipes/can-write.pipe';

@Component({
  selector: 'app-lesson',
  standalone: true,
  template: `
    @if (detailsService.loaded()) {
    <header class="mt-10">
      <div class="lg:flex lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2
            class="text-2xl font-bold leading-7 text-zinc-900 sm:truncate sm:text-3xl sm:tracking-tight"
          >
            {{ detailsService.vocabulary()?.title }}
          </h2>
          <div class="mt-1 flex sm:mt-0 sm:flex-row sm:flex-wrap space-x-6">
            <div
              class="mt-2 flex items-center text-base text-zinc-500"
              data-testid="lesson-date"
            >
              <svg
                class="mr-1.5 h-5 w-5 flex-shrink-0 text-zinc-400"
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
              class="mt-2 flex items-center text-sm text-zinc-500"
              data-testid="important-badge"
            >
              <span
                class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                >{{ 'vocabulary.important' | translate }}</span
              >
            </div>
            }
          </div>
        </div>

        @if(authService.user()?.emailVerified && (detailsService.vocabulary()! |
        canWrite) ) {
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
      <div
        class="mt-10 p-4 sm:p-8 relative h-full w-full rounded-xl bg-white border-zinc-200 border forced-colors:outline"
      >
        <dl class="divide-y divide-zinc-100">
          <div
            class="px-4 pb-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            data-testid="type"
          >
            <dt
              class="text-base font-medium leading-6 text-zinc-900"
              translate="vocabulary.type.label"
            ></dt>
            <dd
              class="mt-1 text-base leading-6 text-zinc-700 sm:col-span-2 sm:mt-0"
            >
              {{
                'vocabulary.type.' + detailsService.vocabulary()?.type
                  | translate
              }}
            </dd>
          </div>
          @if (detailsService.vocabulary()?.translation) {
          <div
            class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            data-testid="translation"
          >
            <dt
              class="text-base font-medium leading-6 text-zinc-900"
              translate="vocabulary.translation"
            ></dt>
            <dd
              class="mt-1 text-base leading-6 text-zinc-700 sm:col-span-2 sm:mt-0"
            >
              {{ detailsService.vocabulary()?.translation }}
            </dd>
          </div>
          } @if (detailsService.vocabulary()?.definitions?.length) {
          <div
            class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            data-testid="definitions"
          >
            <dt
              class="text-base font-medium leading-6 text-zinc-900"
              translate="vocabulary.definitions"
            ></dt>
            <dd
              class="mt-1 text-base leading-6 text-zinc-700 sm:col-span-2 sm:mt-0"
            >
              <ul role="list" class="list-disc space-y-2 pl-4 mt-1">
                @for (item of detailsService.vocabulary()?.definitions; track
                $index) {
                <li class="text-zinc-400 text-base">
                  <span class="text-zinc-600"> {{ item }} </span>
                </li>
                }
              </ul>
            </dd>
          </div>
          } @if (detailsService.vocabulary()?.examples?.length) {
          <div
            class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            data-testid="examples"
          >
            <dt
              class="text-base font-medium leading-6 text-zinc-900"
              translate="vocabulary.examples"
            ></dt>
            <dd
              class="mt-1 text-base leading-6 text-zinc-700 sm:col-span-2 sm:mt-0"
            >
              <ul role="list" class="list-disc space-y-2 pl-4 mt-1">
                @for (item of detailsService.vocabulary()?.examples; track
                $index) {
                <li class="text-zinc-400 text-base">
                  <span class="text-zinc-600"> {{ item }} </span>
                </li>
                }
              </ul>
            </dd>
          </div>
          } @if (detailsService.vocabulary()?.links?.length) {
          <div
            class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            data-testid="links"
          >
            <dt
              class="text-base font-medium leading-6 text-zinc-900"
              translate="vocabulary.links"
            ></dt>
            <dd
              class="mt-1 text-base leading-6 text-zinc-700 sm:col-span-2 sm:mt-0"
            >
              <ul role="list" class="list-disc space-y-2 pl-4 mt-1">
                @for (item of detailsService.vocabulary()?.links; track $index)
                {
                <li class="text-zinc-400 text-base">
                  <a
                    [href]="item.link"
                    target="_blank"
                    class="font-medium text-emerald-700 hover:text-emerald-500"
                  >
                    {{ item.title }}</a
                  >
                </li>
                }
              </ul>
            </dd>
          </div>
          }
        </dl>
      </div>
    </main>
    } @else {
    <span>loading</span>
    }
  `,
  imports: [
    TranslateModule,
    MatButton,
    FirebaseToDatePipe,
    EmptyListComponent,
    CanWritePipe,
  ],
})
export class VocabularyDetailsComponent implements OnInit {
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

    effect(() => {
      if (this.detailsService.loaded() && !this.detailsService.vocabulary()) {
        this.router.navigate(['']);
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
