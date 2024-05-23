import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-list',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div
      data-testid="empty-list-element"
      class="flex items-center justify-center flex-col mt-8"
    >
      <h3
        class="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
        translate="commons.emptyList"
      ></h3>
    </div>
  `,
})
export class EmptyListComponent {}
