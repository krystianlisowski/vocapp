import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { AddLessonDialogComponent } from '../../../home/ui/add-lesson-dialog/add-lesson-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Vocabulary } from '../../../shared/models/vocabulary.model';
import { FormArrayControlComponent } from '../../../shared/ui/form-array-control/form-array-control.component';
import { FormArrayGroupComponent } from '../../../shared/ui/form-array-group/form-array-group.component';

type VocabularyArray = keyof Pick<Vocabulary, 'examples' | 'links'>;
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
    FormArrayControlComponent,
    FormArrayGroupComponent,
  ],
  template: `
    <h2 mat-dialog-title translate="addVocabularyDialog.heading"></h2>
    <mat-dialog-content>
      <form [formGroup]="formGroup" class="add-phrase-form">
        <mat-form-field appearance="outline">
          <mat-label translate="vocabulary.title"></mat-label>
          <input formControlName="title" matInput />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label translate="vocabulary.translation"></mat-label>
          <input formControlName="translation" matInput />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label translate="vocabulary.definition"></mat-label>
          <textarea matInput formControlName="definition"></textarea>
        </mat-form-field>

        <ng-container formArrayName="examples">
          <app-form-array-control
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
      <button mat-button mat-dialog-close translate="commons.cancel"></button>
      <button mat-button (click)="submit()" translate="commons.save"></button>
    </mat-dialog-actions>
  `,
  styles: `
    .add-phrase-form {
      display: block;
      margin-top: 0.5rem;
      max-width: 40rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVocabularyDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddLessonDialogComponent>);
  formGroup = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required]),
    translation: this.fb.nonNullable.control('', [Validators.required]),
    definition: this.fb.nonNullable.control('', [Validators.required]),
    examples: this.fb.nonNullable.array<FormControl>([]),
    links: this.fb.nonNullable.array<FormGroup<LinkForm>>([]),
  });

  submit() {
    this.formGroup.markAllAsTouched();

    if (!this.formGroup.valid) {
      return;
    }

    this.dialogRef.close(this.formGroup.value);
  }

  addExample() {
    const control = this.fb.control('');
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
