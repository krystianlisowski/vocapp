import { Injectable, computed, inject, signal } from '@angular/core';
import {
  signInWithEmailAndPassword,
  User,
  authState,
  signOut,
  createUserWithEmailAndPassword,
  Auth,
} from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, defer, from } from 'rxjs';
import { Credentials } from '../models/credentials.model';

export type AuthUser = User | null | undefined;
interface AuthState {
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Dependencies
  private auth = inject(Auth);

  // State
  private state = signal<AuthState>({
    user: undefined,
  });

  // Selectors
  user = computed(() => this.state().user);

  // Sources
  private user$!: Observable<User | null>;

  constructor() {
    this.user$ = authState(this.auth);
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
      }))
    );
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
        )
      )
    );
  }
}
