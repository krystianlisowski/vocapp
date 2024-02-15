import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-add-vocabulary-dialog',
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
  ],
  template: `
    <h2 mat-dialog-title translate="addLessonDialog.heading"></h2>
    <mat-dialog-content>
      <form [formGroup]="formGroup" class="add-lesson-form">
        <mat-form-field appearance="outline">
          <mat-label translate="lesson.title"></mat-label>
          <input formControlName="title" matInput />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label translate="lesson.studentsCount"></mat-label>
          <input matInput type="number" formControlName="studentsCount" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close translate="commons.cancel"></button>
      <button
        mat-button
        (click)="submit()"
        [disabled]="!formGroup.valid"
        translate="commons.save"
      ></button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVocabularyDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddLessonDialogComponent>);
  formGroup = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required]),
    date: this.fb.nonNullable.control('', [Validators.required]),
    studentsCount: this.fb.control<number | null>(null, [Validators.required]),
  });

  submit() {
    this.formGroup.markAllAsTouched();

    if (!this.formGroup.valid) {
      return;
    }

    this.dialogRef.close(this.formGroup.value);
  }
}
