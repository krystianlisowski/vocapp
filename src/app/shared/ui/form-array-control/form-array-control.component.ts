import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-form-array-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatSuffix,
    MatFormField,
    MatInput,
    MatIconButton,
    MatLabel,
  ],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-2">
      <span>{{ arrayLabel() }}</span>
      <button mat-icon-button aria-label="Add item" (click)="addItem.emit()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
    @for(control of formArray().controls; let idx = $index; track idx) {
    <mat-form-field appearance="outline">
      <mat-label>{{ controlLabel() + ' ' + (idx + 1) }}</mat-label>
      <input matInput [formControl]="control" />
      <button
        mat-icon-button
        matSuffix
        (click)="deleteItem.emit(idx)"
        color="warn"
      >
        <mat-icon> delete_forever</mat-icon>
      </button>
    </mat-form-field>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayControlComponent {
  arrayLabel = input.required<string>();
  formArray = input.required<FormArray<FormControl>>();
  controlLabel = input<string>();

  @Output() addItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter<number>();
}
