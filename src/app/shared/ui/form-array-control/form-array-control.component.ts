import { Component, EventEmitter, Output, input } from '@angular/core';
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
    <div class="flex items-center justify-between mb-2">
      <span data-testid="array-label">{{ arrayLabel() }}</span>
      <button
        data-testid="add-item-button"
        mat-icon-button
        aria-label="Add item"
        (click)="addItem.emit()"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
    @for(control of formArray().controls; let idx = $index; track idx) {
    <mat-form-field
      appearance="outline"
      data-testid="array-control"
      class="block w-full"
    >
      <mat-label data-testid="control-label">{{
        controlLabel() + ' ' + (idx + 1)
      }}</mat-label>
      <input matInput [formControl]="control" />
      <button
        mat-icon-button
        matSuffix
        data-testid="delete-item-button"
        (click)="deleteItem.emit(idx)"
        color="warn"
      >
        <mat-icon> delete_forever</mat-icon>
      </button>
    </mat-form-field>
    }
  `,
})
export class FormArrayControlComponent {
  arrayLabel = input.required<string>();
  formArray = input.required<FormArray<FormControl>>();
  controlLabel = input<string>();

  @Output() addItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter<number>();
}
