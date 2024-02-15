import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { Vocabulary } from '../../../shared/models/vocabulary.model';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vocabulary-item',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title> {{ item.title }} </mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-4">
        <div>
          <mat-card-subtitle translate="vocabulary.translation">
          </mat-card-subtitle>
          <p>{{ item.translation }}</p>
        </div>
        <div>
          <mat-card-subtitle
            translate="vocabulary.definition"
          ></mat-card-subtitle>
          <p>{{ item.definition }}</p>
        </div>

        @if(item.examples?.length) {
        <div>
          <mat-card-subtitle
            translate="vocabulary.examples"
          ></mat-card-subtitle>
          <ul>
            @for (example of item.examples; track $index){
            <li>{{ example }}</li>
            }
          </ul>
        </div>
        } @if(item.links?.length) {
        <div>
          <mat-card-subtitle translate="vocabulary.links"></mat-card-subtitle>
          <ul>
            @for (link of item.links; track $index){
            <li>
              <a [href]="link.link" target="_blank"> {{ link.title }}</a>
            </li>
            }
          </ul>
        </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabularyItemComponent {
  @Input({ required: true }) item!: Vocabulary;
}
