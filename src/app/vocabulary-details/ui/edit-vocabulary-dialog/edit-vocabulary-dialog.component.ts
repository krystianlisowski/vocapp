import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import {
  LinkForm,
  VocabularyArray,
  VocabularyForm,
  VocabularyLink,
  vocabularyTypeOptions,
} from '../../../shared/models/vocabulary.model';
import { FormArrayControlComponent } from '../../../shared/ui/form-array-control/form-array-control.component';
import { FormArrayGroupComponent } from '../../../shared/ui/form-array-group/form-array-group.component';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDatepicker,
  MatDatepickerToggle,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

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
  providers: [provideNativeDateAdapter()],
})
export class EditVocabularyDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(
    MatDialogRef<EditVocabularyDialogComponent>
  );
  private data = inject(MAT_DIALOG_DATA);

  formGroup!: FormGroup<VocabularyForm>;
  vocabularyTypeOptions = vocabularyTypeOptions;

  ngOnInit(): void {
    const {
      title,
      translation,
      definitions,
      examples,
      links,
      type,
      important,
      lessonDate,
    } = this.data.phrase;

    this.formGroup = this.fb.nonNullable.group({
      title: this.fb.nonNullable.control(title || '', [Validators.required]),
      type: this.fb.nonNullable.control(type, [Validators.required]),
      translation: this.fb.nonNullable.control(translation || '', [
        Validators.required,
      ]),
      definitions: this.fb.nonNullable.array<FormControl>(definitions || [], [
        Validators.minLength(1),
      ]),
      lessonDate: this.fb.nonNullable.control(lessonDate.toDate(), [
        Validators.required,
      ]),
      important: this.fb.nonNullable.control(important || false),
      examples: this.fb.nonNullable.array<FormControl>(examples || []),
      links: this.fb.nonNullable.array<FormGroup<LinkForm>>([]),
    });

    links.map((item: VocabularyLink) => this.addLink(item.title, item.link));
  }

  submit() {
    this.formGroup.markAllAsTouched();

    if (!this.formGroup.valid) {
      return;
    }

    this.dialogRef.close(this.formGroup.value);
  }

  addDefinition() {
    const control = this.fb.nonNullable.control('', [Validators.required]);
    this.formGroup.controls.definitions.push(control);
  }

  addExample() {
    const control = this.fb.nonNullable.control('');
    this.formGroup.controls.examples.push(control);
  }

  addLink(title?: string, link?: string) {
    const linkGroup = this.fb.group({
      title: this.fb.nonNullable.control(title || ''),
      link: this.fb.nonNullable.control(link || ''),
    });

    this.formGroup.controls.links.push(linkGroup);
  }

  deleteItem(array: VocabularyArray, index: number) {
    this.formGroup.controls[array].removeAt(index);
  }
}
