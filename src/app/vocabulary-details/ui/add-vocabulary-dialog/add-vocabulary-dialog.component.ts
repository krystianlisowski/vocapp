import { Component, computed, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import {
  Vocabulary,
  VocabularyForm,
  vocabularyTypeOptions,
} from '../../../shared/models/vocabulary.model';
import { FormArrayControlComponent } from '../../../shared/ui/form-array-control/form-array-control.component';
import { FormArrayGroupComponent } from '../../../shared/ui/form-array-group/form-array-group.component';
import {
  DictionaryService,
  VocabularyType,
} from '../../data-acess/dictionary.service';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { map, pairwise, startWith, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';

type VocabularyArray = keyof Pick<
  Vocabulary,
  'examples' | 'links' | 'definitions'
>;
type LinkForm = { title: FormControl<string>; link: FormControl<string> };
@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatSelect,
    MatOption,
    FormArrayControlComponent,
    FormArrayGroupComponent,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatCheckbox,
  ],
  template: `
    <h2
      mat-dialog-title
      translate="addVocabularyDialog.heading"
      data-testid="dialog-title"
    ></h2>

    <mat-dialog-content>
      @if (showDictionaryButton()) {
      <div class="w-full text-right">
        <span
          (click)="
            dictionaryService.onDictionarySearch(
              formGroup.controls.title.value,
              formGroup.controls.type!.value
            )
          "
          class="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-700 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2"
        >
          {{ 'addVocabularyDialog.dictionarySearch' | translate }}
        </span>

        @if (dictionaryService.definitionsCount()) {
        <div>
          {{ dictionaryService.currentIndex() + 1 }} z
          {{ dictionaryService.definitionsCount() }}
        </div>
        }
      </div>
      }
      <form [formGroup]="formGroup" class="py-5" data-testid="form-group">
        <mat-form-field
          appearance="outline"
          data-testid="title-control"
          class="block w-full"
        >
          <mat-label translate="vocabulary.title"></mat-label>
          <input formControlName="title" matInput />
        </mat-form-field>

        <div class="grid grid-cols-2 gap-2">
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

          <mat-form-field
            appearance="outline"
            data-testid="translation-control"
            class="block w-full"
          >
            <mat-label translate="vocabulary.translation"></mat-label>
            <input formControlName="translation" matInput />
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-2">
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
            data-testid="important-control"
          >
            {{ 'vocabulary.important' | translate }}
          </mat-checkbox>
        </div>

        <ng-container formArrayName="definitions">
          <app-form-array-control
            data-testid="definitions-array"
            [formArray]="formGroup.controls.definitions"
            [arrayLabel]="'vocabulary.definitions' | translate"
            [controlLabel]="'vocabulary.definition' | translate"
            (addItem)="addDefinition()"
            (deleteItem)="deleteItem('definitions', $event)"
          ></app-form-array-control>
        </ng-container>

        <ng-container formArrayName="examples">
          <app-form-array-control
            data-testid="examples-array"
            [formArray]="formGroup.controls.examples"
            [arrayLabel]="'vocabulary.examples' | translate"
            [controlLabel]="'vocabulary.example' | translate"
            (addItem)="addExample()"
            (deleteItem)="deleteItem('examples', $event)"
          ></app-form-array-control>
        </ng-container>

        <ng-container formArrayName="links">
          <app-form-array-group
            [formArray]="formGroup.controls.links"
            [arrayLabel]="'vocabulary.links' | translate"
            (addItem)="addLink()"
            (deleteItem)="deleteItem('links', $event)"
          ></app-form-array-group>
        </ng-container>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button
        mat-button
        mat-dialog-close
        translate="commons.cancel"
        data-testid="close-button"
      ></button>
      <button
        mat-button
        (click)="submit()"
        translate="commons.save"
        [disabled]="!formGroup.valid"
        data-testid="submit-button"
      ></button>
    </mat-dialog-actions>
  `,
  providers: [provideNativeDateAdapter(), DictionaryService],
})
export class AddVocabularyDialogComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly dictionaryService = inject(DictionaryService);
  private readonly dialogRef = inject(
    MatDialogRef<AddVocabularyDialogComponent>
  );
  formGroup = this.fb.nonNullable.group<VocabularyForm>({
    title: this.fb.nonNullable.control('', [Validators.required]),
    type: this.fb.nonNullable.control<VocabularyType>('verb', [
      Validators.required,
    ]),
    translation: this.fb.nonNullable.control(''),
    definitions: this.fb.nonNullable.array<FormControl>(
      [],
      [Validators.minLength(1)]
    ),
    lessonDate: this.fb.nonNullable.control('', [Validators.required]),
    important: this.fb.nonNullable.control(false),
    examples: this.fb.nonNullable.array<FormControl>([]),
    links: this.fb.nonNullable.array<FormGroup<LinkForm>>([]),
  });

  onTypeChange = toSignal(
    this.formGroup.controls.type!.valueChanges.pipe(
      tap((val) =>
        this.dictionaryService.onDictionarySearch(
          this.formGroup.controls.title.value,
          val
        )
      )
    )
  );
  vocabularyTypeOptions = vocabularyTypeOptions;

  showDictionaryButton = toSignal(
    this.formGroup.controls.title.valueChanges.pipe(
      startWith(this.formGroup.controls.title.value),
      pairwise(),
      map(([prev, curr]) => curr && curr !== prev)
    )
  );

  constructor() {
    effect(() => {
      this.formGroup.controls.definitions.clear();
      this.dictionaryService.definitions()?.forEach((item) => {
        this.addDefinition(item);
      });
    });
    effect(() => {
      if (this.dictionaryService.error()) {
        this.formGroup.controls.definitions.clear();
      }
    });
  }

  submit() {
    this.formGroup.markAllAsTouched();

    if (!this.formGroup.valid) {
      return;
    }

    this.dialogRef.close(this.formGroup.value);
  }

  addDefinition(value = '') {
    const control = this.fb.nonNullable.control(value, [Validators.required]);
    this.formGroup.controls.definitions.push(control);
  }

  addExample() {
    const control = this.fb.nonNullable.control('');
    this.formGroup.controls.examples.push(control);
  }

  addLink() {
    const linkGroup = this.fb.group({
      title: this.fb.nonNullable.control(''),
      link: this.fb.nonNullable.control(''),
    });

    this.formGroup.controls.links.push(linkGroup);
  }

  deleteItem(array: VocabularyArray, index: number) {
    this.formGroup.controls[array].removeAt(index);
  }
}
