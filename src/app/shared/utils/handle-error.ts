import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';

export const handleError = (error: string): Observable<never> => {
  const snackBar = inject(MatSnackBar);
  snackBar.open(error, 'Close', { duration: 5000 });
  return EMPTY;
};
