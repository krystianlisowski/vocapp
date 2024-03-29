import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
    <table mat-table [dataSource]="datatable.rows()" class="mat-elevation-z8">
      <!--- Note that these columns can be defined in any order.
      The actual rendered columns are set as a property on the row definition" -->

      @for (col of datatable.visibleCols; let idx = $index; track idx; let last
      = $last;) {
      <ng-container [matColumnDef]="datatable.visibleColsKeys[idx]">
        <th mat-header-cell *matHeaderCellDef [class.text-right]="last">
          {{ col.header | translate }}
        </th>
        <td mat-cell *matCellDef="let element" [class.text-right]="last">
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

      <tr mat-header-row *matHeaderRowDef="datatable.visibleColsKeys"></tr>
      <tr mat-row *matRowDef="let row; columns: datatable.visibleColsKeys"></tr>
    </table>
  `,
  styles: `
    .table-col {
      display: flex;
      align-items: center;
      flex: 1;
      flex-basis: 120px;
    }

    .table-row {
      display: flex;
      align-items: center;
    }

    .text-right {
      text-align: end;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent<T extends { [key: string]: any }> {
  @Input({ required: true }) datatable!: DatatableManager<T>;
}
