import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/data-access/auth.service';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { Credentials } from '../../shared/models/credentials.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
  // Dependencies
  private authService = inject(AuthService);

  // State
  private state = signal<RegisterState>({
    status: 'pending',
  });

  // Sources
  error$ = new Subject<any>();
  createUser$ = new Subject<Credentials>();
  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  // Selectors
  status = computed(() => this.state().status);

  constructor() {
    // Reducers
    this.userCreated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'success' }))
      );

    this.createUser$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'creating' }))
      );

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'error' }))
      );
  }
}
