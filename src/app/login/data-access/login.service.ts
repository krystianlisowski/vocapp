import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/data-access/auth.service';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { Credentials } from '../../shared/models/credentials.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  // State
  private state = signal<LoginState>({
    status: 'pending',
  });

  // Sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();
  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
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
    this.userAuthenticated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'success' }))
      );

    this.login$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'authenticating' }))
      );

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'error' }))
      );
  }
}
