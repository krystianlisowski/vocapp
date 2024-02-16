import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
    <h2 mat-dialog-title translate="editLessonDialog.heading"></h2>
    <mat-dialog-content>
      <form [formGroup]="formGroup" class="add-lesson-form">
        <mat-form-field appearance="outline">
          <mat-label translate="lesson.title"></mat-label>
          <input formControlName="title" matInput />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label translate="lesson.date"></mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
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
  styles: `
    .add-lesson-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 0.5rem;
      width: 19rem;
      max-width: 19rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLessonDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditLessonDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const { title, date, studentsCount } = this.data.lesson;

    this.formGroup = this.fb.nonNullable.group({
      title: this.fb.nonNullable.control(title || '', [Validators.required]),
      date: this.fb.nonNullable.control(date.toDate() || '', [
        Validators.required,
      ]),
      studentsCount: this.fb.control<number | null>(studentsCount || null, [
        Validators.required,
      ]),
    });
  }

  submit() {
    this.formGroup.markAllAsTouched();

    if (!this.formGroup.valid) {
      return;
    }

    this.dialogRef.close(this.formGroup.value);
  }
}
