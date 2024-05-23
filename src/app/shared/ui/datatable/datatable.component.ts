import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatatableManager } from './datatable';
import { DatatableFormatterPipe } from './datatable-formatter.pipe';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule, DatatableFormatterPipe, TranslateModule],
  template: `
    <div
      class="relative h-full w-full rounded-xl bg-white border-zinc-200 border forced-colors:outline"
    >
      <div
        class="grid h-full w-full justify-items-center overflow-hidden place-items-start p-8 "
      >
        <div class="w-full min-w-0">
          <div class="flow-root">
            <div class="overflow-x-auto whitespace-nowrap">
              <div class="inline-block min-w-full align-middle">
                <table
                  class="min-w-full text-left text-base"
                  data-testid="table-element"
                >
                  <thead class="text-zinc-500">
                    <tr>
                      @for (col of datatable().visibleCols; let idx = $index;
                      track idx; let last = $last;) {
                      <th
                        data-testid="table-header-col"
                        [class.!text-end]="last"
                        class="border-b border-b-zinc-200 px-4 py-2 font-medium sm:first:pl-2 sm:last:pr-2"
                      >
                        {{ col.header | translate }}
                      </th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of datatable().rows(); track $index) {
                    <tr data-testid="table-row">
                      @for (col of datatable().visibleCols; let idx = $index;
                      track idx; let last = $last;) {

                      <td
                        [class.!text-end]="last"
                        class="text-zinc-500  relative px-4 border-b border-zinc-100  py-2 sm:first:pl-2 sm:last:pr-2"
                      >
                        @if (col.template) {
                        <ng-container
                          *ngTemplateOutlet="
                            col.template;
                            context: { item: row }
                          "
                        ></ng-container>
                        } @else {
                        {{ row | datatableFormatter : col }}
                        }
                      </td>
                      }
                    </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent<T extends { [key: string]: any }> {
  datatable = input.required<DatatableManager<T>>();
}
