import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
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
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
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
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatSuffix,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2
      mat-dialog-title
      translate="addLessonDialog.heading"
      data-testid="dialog-title"
    ></h2>
    <mat-dialog-content>
      <form
        [formGroup]="formGroup"
        class="flex flex-col py-5"
        data-testid="form-group"
      >
        <mat-form-field appearance="outline" data-testid="title-control">
          <mat-label translate="lesson.title"></mat-label>
          <input formControlName="title" matInput />
        </mat-form-field>

        <mat-form-field appearance="outline" data-testid="date-control">
          <mat-label translate="lesson.date"></mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" data-testid="students-control">
          <mat-label translate="lesson.studentsCount"></mat-label>
          <input matInput type="number" formControlName="studentsCount" />
        </mat-form-field>
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
        data-testid="submit-button"
        (click)="submit()"
        [disabled]="!formGroup.valid"
        translate="commons.save"
      ></button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddLessonDialogComponent {
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
