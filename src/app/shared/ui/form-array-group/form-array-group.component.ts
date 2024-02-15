import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormGroupKeysPipe } from '../../pipes/form-group-keys.pipe';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-array-group',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatIconButton,
    MatLabel,
    FormGroupKeysPipe,
  ],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-2">
      <span>{{ arrayLabel }}</span>
      <button mat-icon-button aria-label="Add item" (click)="addItem.emit()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
    @for(group of formArray.controls; let idx = $index; track idx) {
    <div class="d-flex" [formGroup]="group">
      @for(controlName of group | formGroupKeys; track $index) {
      <mat-form-field appearance="outline" class="mr-1">
        <mat-label [translate]="'formLabels.' + controlName"></mat-label>
        <input matInput [formControlName]="controlName" />
      </mat-form-field>
      }
      <button
        mat-icon-button
        (click)="deleteItem.emit(idx)"
        color="warn"
        class="mt-1"
      >
        <mat-icon> delete_forever</mat-icon>
      </button>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayGroupComponent<
  T extends { [K in keyof T]: AbstractControl<any, any> }
> {
  @Input({ required: true }) arrayLabel!: string;
  @Input({ required: true }) formArray!: FormArray<FormGroup<T>>;

  @Output() addItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter<number>();
}
