import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatatableManager } from './datatable';
import { DatatableFormatterPipe } from './datatable-formatter.pipe';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    DatatableFormatterPipe,
    TranslateModule,
    MatTable,
    MatHeaderRow,
    MatRow,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatRowDef,
    MatHeaderRowDef,
  ],
  template: `
    <table
      mat-table
      [dataSource]="datatable().rows()"
      data-testid="table-element"
    >
      <!--- Note that these columns can be defined in any order.
      The actual rendered columns are set as a property on the row definition" -->

      @for (col of datatable().visibleCols; let idx = $index; track idx; let
      last = $last;) {
      <ng-container [matColumnDef]="datatable().visibleColsKeys[idx]">
        <th
          mat-header-cell
          *matHeaderCellDef
          [class.!text-end]="last"
          class="border border-slate-300 !bg-slate-50"
          data-testid="table-header-col"
        >
          {{ col.header | translate }}
        </th>
        <td
          mat-cell
          *matCellDef="let element"
          [class.!text-end]="last"
          class="border border-slate-300"
          data-testid="table-col"
        >
          @if (col.template) {
          <ng-container
            *ngTemplateOutlet="col.template; context: { item: element }"
          ></ng-container>
          } @else {
          {{ element | datatableFormatter : col }}
          }
        </td>
      </ng-container>
      }

      <tr
        data-testid="table-header"
        mat-header-row
        *matHeaderRowDef="datatable().visibleColsKeys"
        data-testid="table-element"
      ></tr>
      <tr
        data-testid="table-row"
        mat-row
        class="border border-slate-300"
        *matRowDef="let row; columns: datatable().visibleColsKeys"
      ></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent<T extends { [key: string]: any }> {
  datatable = input.required<DatatableManager<T>>();
}
