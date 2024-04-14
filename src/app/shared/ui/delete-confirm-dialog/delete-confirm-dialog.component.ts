import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle,
  MatDialogClose,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [
    TranslateModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose,
    MatButton,
  ],
  template: ` <h2 mat-dialog-title translate="deleteConfirmDialog.heading"></h2>
    <mat-dialog-content>
      <span translate="deleteConfirmDialog.description"></span>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button
        data-testid="close-button"
        mat-button
        mat-dialog-close
        translate="commons.cancel"
      ></button>
      <button
        data-testid="submit-button"
        mat-button
        mat-dialog-close="true"
        color="warn"
        translate="commons.delete"
      ></button>
    </mat-dialog-actions>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmDialogComponent {}
