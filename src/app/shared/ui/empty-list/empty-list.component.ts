import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-list',
  standalone: true,
  imports: [TranslateModule, MatIcon],
  template: `
    <div
      data-testid="empty-list-element"
      class="d-flex align-items-center justify-content-center flex-column my-5"
    >
      <mat-icon>info</mat-icon>
      <h3 translate="commons.emptyList"></h3>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;

        h3 {
          font-size: 2rem;
        }

        mat-icon {
          font-size: 2rem;
          height: 2rem;
          width: 2rem;
          margin-bottom: 1rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyListComponent {}
