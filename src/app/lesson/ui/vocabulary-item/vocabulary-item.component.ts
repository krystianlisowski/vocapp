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
      <mat-card-header>
        <mat-card-title> {{ item().title }} </mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-4">
        <div>
          <mat-card-subtitle translate="vocabulary.translation">
          </mat-card-subtitle>
          <p>{{ item().translation }}</p>
        </div>
        <div>
          <mat-card-subtitle
            translate="vocabulary.definition"
          ></mat-card-subtitle>
          <p>{{ item().definition }}</p>
        </div>

        @if(item().examples.length) {
        <div>
          <mat-card-subtitle
            translate="vocabulary.examples"
          ></mat-card-subtitle>
          <ul>
            @for (example of item().examples; track $index){
            <li>{{ example }}</li>
            }
          </ul>
        </div>
        } @if(item().links.length) {
        <div>
          <mat-card-subtitle translate="vocabulary.links"></mat-card-subtitle>
          <ul>
            @for (link of item().links; track $index){
            <li>
              <a [href]="link.link" target="_blank"> {{ link.title }}</a>
            </li>
            }
          </ul>
        </div>
        }
      </mat-card-content>
      @if(item() | canWrite) {
      <mat-card-actions align="end">
        <button
          mat-icon-button
          (click)="itemEdited.emit(item())"
          [matTooltip]="'tooltip.edit' | translate"
        >
          <mat-icon>settings</mat-icon>
        </button>

        <button
          [matTooltip]="'tooltip.edit' | translate"
          mat-icon-button
          color="warn"
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
