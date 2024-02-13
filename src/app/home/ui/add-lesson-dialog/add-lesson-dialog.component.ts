import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-add-lesson-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title translate="addLessonDialog.heading"></h2>
    <mat-dialog-content class="mat-typography">
      <form [formGroup]="formGroup" class="add-lesson-form">
        <mat-form-field>
          <mat-label translate="lesson.title"></mat-label>
          <input formControlName="title" matInput />
        </mat-form-field>
        <mat-form-field>
          <mat-label translate="lesson.date"></mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
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
  styles: `
    .add-lesson-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
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
