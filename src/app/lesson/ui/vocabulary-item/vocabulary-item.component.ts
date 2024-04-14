import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { Vocabulary } from '../../../shared/models/vocabulary.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { CanWritePipe } from '../../../shared/pipes/can-write.pipe';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-vocabulary-item',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatTooltip,
    CanWritePipe,
  ],
  template: `
    <mat-card>
      <mat-card-content class="mt-4">
        <div>
          <div class="px-4 sm:px-0">
            <h3 class="text-base font-semibold leading-7 text-gray-900">
              {{ item().title }}
            </h3>
          </div>
          <div class="mt-6 border-t border-gray-100">
            <dl class="divide-y divide-gray-100">
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt
                  class="text-sm font-medium leading-6 text-gray-900"
                  translate="vocabulary.translation"
                ></dt>
                <dd
                  class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                >
                  {{ item().translation }}
                </dd>
              </div>
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt
                  class="text-sm font-medium leading-6 text-gray-900"
                  translate="vocabulary.definition"
                ></dt>
                <dd
                  class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                >
                  <p>{{ item().definition }}</p>
                </dd>
              </div>
              @if(item().examples.length) {
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt
                  class="text-sm font-medium leading-6 text-gray-900"
                  translate="vocabulary.examples"
                ></dt>
                <dd
                  class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                >
                  <ul
                    role="list"
                    class="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    @for (example of item().examples; track $index){

                    <li
                      class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                    >
                      <div class="flex w-0 flex-1 items-center">
                        <div class="ml-4 flex min-w-0 flex-1 gap-2">
                          <span class="truncate font-medium">
                            <li>{{ example }}</li>
                          </span>
                        </div>
                      </div>
                    </li>
                    }
                  </ul>
                </dd>
              </div>
              } @if(item().links.length) {
              <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt
                  class="text-sm font-medium leading-6 text-gray-900"
                  translate="vocabulary.links"
                ></dt>
                <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    class="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    @for (link of item().links; track $index){
                    <li
                      class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                    >
                      <div class="flex w-0 flex-1 items-center">
                        <div class="ml-4 flex min-w-0 flex-1 gap-2">
                          <a
                            [href]="link.link"
                            target="_blank"
                            class="font-medium text-indigo-700 hover:text-indigo-500"
                          >
                            {{ link.title }}</a
                          >
                        </div>
                      </div>
                    </li>
                    }
                  </ul>
                </dd>
              </div>
              }
            </dl>
          </div>
        </div>
      </mat-card-content>
      @if(item() | canWrite) {
      <mat-card-actions align="end" data-testid="vocabulary-item-actions">
        <button
          mat-icon-button
          (click)="itemEdited.emit(item())"
          data-testid="edit-vocabulary-item-button"
          [matTooltip]="'tooltip.edit' | translate"
        >
          <mat-icon>settings</mat-icon>
        </button>

        <button
          [matTooltip]="'tooltip.delete' | translate"
          mat-icon-button
          color="warn"
          data-testid="delete-vocabulary-item-button"
          (click)="itemDeleted.emit(item().id)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </mat-card-actions>
      }
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
      width: 100%
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabularyItemComponent {
  item = input.required<Vocabulary>();
  @Output() itemDeleted = new EventEmitter<string>();
  @Output() itemEdited = new EventEmitter<Vocabulary>();
}
