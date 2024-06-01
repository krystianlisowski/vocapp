import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  effect,
  input,
  signal,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatPaginator],
  template: `
    @if (totalSize()) {
    <mat-paginator
      class="!bg-transparent mt-4"
      data-testid="pagination"
      [length]="totalSize()"
      [pageSize]="rowsPerPage()"
      [pageIndex]="pageIndex()"
      [hidePageSize]="true"
      (page)="onPageChanged($event)"
      aria-label="Select page"
    >
    </mat-paginator>
    }
  `,
})
export class PaginationComponent {
  totalSize = input.required<number | null>();
  rowsPerPage = input<number>(10);
  pageIndex = signal(0);

  @Output() pageChanged = new EventEmitter<PageEvent>();

  constructor() {
    effect(
      () => {
        if (this.totalSize()) {
          this.pageIndex.set(0);
        }
      },
      { allowSignalWrites: true }
    );
  }

  onPageChanged(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageChanged.emit(event);
  }
}
