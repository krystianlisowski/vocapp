import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private snackBar = inject(MatSnackBar);

  handleError(error: string): Observable<never> {
    this.snackBar.open(error, 'Close', { duration: 5000 });
    return EMPTY;
  }
}
