import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { VocabularyType } from '../../../vocabulary-details/data-acess/dictionary.service';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { VocabularyListFilters } from '../../data-acess/vocabulary-list.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { vocabularyTypeOptions } from '../../../shared/models/vocabulary.model';

@Component({
  selector: 'app-vocabulary-list-filters',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatCheckbox,
    MatSuffix,
    MatButton,
  ],
  template: `
    <div
      class="border border-zinc-200 bg-white  pb-3 pt-8 px-8  mb-10 relative rounded-xl"
    >
      <form [formGroup]="formGroup" data-testid="form-group">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <mat-form-field
            appearance="outline"
            data-testid="title-control"
            class="block w-full"
          >
            <mat-label translate="vocabulary.title"></mat-label>
            <input formControlName="title" matInput />
          </mat-form-field>

          <mat-form-field
            appearance="outline"
            data-testid="type-control"
            class="block w-full"
          >
            <mat-label translate="vocabulary.type.label"></mat-label>
            <mat-select formControlName="type" name="type">
              @for (item of vocabularyTypeOptions; track $index) {
              <mat-option [value]="item.value">
                {{ item.label | translate }}
              </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" data-testid="date-control">
            <mat-label translate="vocabulary.lessonDate"></mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="lessonDate"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-checkbox
            [formControl]="formGroup.controls.important"
            color="primary"
            data-testid="important-control"
          >
            {{ 'vocabulary.important' | translate }}
          </mat-checkbox>
        </div>
      </form>

      @if (filtersModified()) {
      <span class="absolute bottom-4 right-4" data-testid="reset-button">
        <button
          mat-button
          (click)="formGroup.reset()"
          type="button"
          color="warn"
        >
          {{ 'commons.resetFilters' | translate }}
        </button>
      </span>
      }
    </div>
  `,
  providers: [provideNativeDateAdapter()],
})
export class VocabularyListFiltersComponent {
  #fb = inject(FormBuilder);
  formGroup = this.#fb.group({
    title: this.#fb.control<string | null>(null),
    type: this.#fb.control<VocabularyType | null>(null),
    lessonDate: this.#fb.control<string | null>(null),
    important: this.#fb.control<boolean | null>(null),
  });
  vocabularyTypeOptions = vocabularyTypeOptions;

  #onFormsChanged = toSignal(
    this.formGroup.valueChanges.pipe(
      tap((value) => this.filtersChanged.emit(value))
    )
  );

  filtersModified = computed(() => {
    if (!this.#onFormsChanged()) {
      return false;
    }

    return Object.values(this.#onFormsChanged()!).some((val) => val);
  });

  @Output() filtersChanged = new EventEmitter<Partial<VocabularyListFilters>>();
}
