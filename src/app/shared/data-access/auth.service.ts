import { Injectable, computed, inject, signal } from '@angular/core';
import {
  signInWithEmailAndPassword,
  User,
  authState,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  Auth,
} from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, defer, exhaustMap, from } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { ErrorHandlerService } from '../utils/error-handler.service';

export type AuthUser = User | null | undefined;
interface AuthState {
  user: any;
  verificationEmailSent: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Dependencies
  private auth = inject(Auth);
  private errorHandler = inject(ErrorHandlerService);

  // State
  private state = signal<AuthState>({
    user: undefined,
    verificationEmailSent: false,
  });

  // Selectors
  user = computed(() => this.state().user);
  verificationEmailSent = computed(() => this.state().verificationEmailSent);

  // Sources
  private user$!: Observable<User | null>;
  emailVerification$ = new Subject<void>();

  constructor() {
    this.user$ = authState(this.auth);
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
      }))
    );

    this.emailVerification$
      .pipe(
        exhaustMap(() =>
          this.sendVerificationEmail().pipe(
            catchError((err) => this.errorHandler.handleError(err))
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.state.update((state) => ({
          ...state,
          verificationEmailSent: true,
        }));
      });
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  logout() {
    signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        ).then(() => this.emailVerification$.next())
      )
    );
  }

  sendVerificationEmail() {
    return from(defer(() => sendEmailVerification(this.auth.currentUser!)));
  }
}
