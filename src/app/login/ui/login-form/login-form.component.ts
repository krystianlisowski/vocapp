import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatPrefix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Credentials } from '../../../shared/models/credentials.model';
import { LoginStatus } from '../../data-access/login.service';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    MatError,
    MatFormField,
    MatInput,
    MatButton,
    MatProgressSpinner,
    MatIcon,
    MatPrefix,
  ],
  template: `
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          translate="login.heading"
          class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        ></h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          [formGroup]="formGroup"
          (ngSubmit)="onSubmit()"
          data-testid="form-group"
        >
          <mat-form-field appearance="outline" class="mb-2 block w-full">
            <input
              matNativeControl
              [placeholder]="'login.email' | translate"
              formControlName="email"
              type="email"
              data-testid="email-control"
              required
            />
            <mat-icon matPrefix>mail</mat-icon>
            <mat-error translate="error.email"> </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="mb-2 block w-full">
            <input
              matNativeControl
              type="password"
              formControlName="password"
              data-testid="password-control"
              [placeholder]="'login.password' | translate"
              required
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error translate="error.password"> </mat-error>
          </mat-form-field>

          @if (loginStatus() === 'error'){
          <mat-error
            data-testid="error-block"
            translate="error.login"
          ></mat-error>
          } @else if(loginStatus() === 'authenticating'){
          <div
            class="d-flex align-items-center justify-content-center"
            data-testid="pending-block"
          >
            <mat-spinner diameter="50"></mat-spinner>
          </div>
          }
          <button
            mat-raised-button
            class="block w-full"
            color="primary"
            type="submit"
            translate="login.confirm"
            data-testid="submit-button"
            [disabled]="loginStatus() === 'authenticating'"
          ></button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          <span translate="login.redirectQuestion"></span>
          <a
            translate="login.redirect"
            data-testid="register-link"
            routerLink="/register"
            class="font-semibold leading-6 text-indigo-700 hover:text-indigo-500 ml-2"
          ></a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  loginStatus = input.required<LoginStatus>();
  @Output() login = new EventEmitter<Credentials>();

  formGroup = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit() {
    if (this.formGroup.valid) {
      this.login.emit(this.formGroup.getRawValue());
    }
  }
}
