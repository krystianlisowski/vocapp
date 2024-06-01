import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { VocabularyListComponent } from './ui/vocabulary-list/vocabualry-list.component';
import { VocabularyListService } from './data-acess/vocabulary-list.service';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/data-access/auth.service';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { AddVocabularyDialogComponent } from '../vocabulary-details/ui/add-vocabulary-dialog/add-vocabulary-dialog.component';
import { VocabularyListFiltersComponent } from './ui/vocabulary-list-filters/vocabulary-list-filters.component';
import { PaginationComponent } from '../shared/ui/pagination/pagination.component';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header class="my-10">
      <div class="lg:flex lg:items-center lg:justify-between my-6">
        <div class="min-w-0 flex-1">
          <h1
            translate="home.heading"
            class="text-2xl font-bold leading-7 text-zinc-900 sm:truncate sm:text-3xl sm:tracking-tight"
          ></h1>
        </div>
        @if(authService.user()?.emailVerified) {
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="block">
            <button mat-raised-button color="primary" (click)="openAddDialog()">
              {{ 'home.addVocabulary' | translate }}
            </button>
          </span>
        </div>
        }
      </div>
    </header>

    <main>
      <app-vocabulary-list-filters
        (filtersChanged)="vocabularyService.filter$.next($event)"
      ></app-vocabulary-list-filters>

      <app-vocabulary-list
        [vocabulary]="vocabularyService.vocabulary()"
        (vocabularyDeleted)="openDeleteDialog($event)"
      ></app-vocabulary-list>

      <app-pagination
        (pageChanged)="onPageChanged($event)"
        [totalSize]="vocabularyService.totalSize()"
        [rowsPerPage]="vocabularyService.rowsPerPage()"
      ></app-pagination>
    </main>
  `,
  imports: [
    VocabularyListComponent,
    MatButton,
    TranslateModule,
    VocabularyListFiltersComponent,
    PaginationComponent,
  ],
})
export class HomeComponent {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  authService = inject(AuthService);
  vocabularyService = inject(VocabularyListService);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['login']);
      }
    });
  }

  onPageChanged(event: PageEvent) {
    this.vocabularyService.filter$.next({
      paginationDirection:
        event.pageIndex! > event.previousPageIndex! ? 'next' : 'prev',
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddVocabularyDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => this.vocabularyService.add$.next(result));
  }

  openDeleteDialog(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.vocabularyService.remove$.next(id));
  }
}
