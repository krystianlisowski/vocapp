import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';
import { RegisterStatus } from '../../data-access/register.service';
import { Credentials } from '../../../shared/models/credentials.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchesValidator } from '../../utils/password-match';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatPrefix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatInput,
    MatButton,
    MatAnchor,
    MatProgressSpinner,
    MatIcon,
    MatPrefix,
  ],
  template: `
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          translate="register.heading"
          class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900"
        ></h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          [formGroup]="formGroup"
          (ngSubmit)="onSubmit()"
          data-testid="form-group"
        >
          <mat-form-field
            appearance="outline"
            class="mb-2 block w-full"
            data-testid="email-control"
          >
            <input
              matNativeControl
              [placeholder]="'register.email' | translate"
              formControlName="email"
              type="email"
              required
            />
            <mat-icon matPrefix>mail</mat-icon>
            <mat-error translate="error.email"></mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="mb-2 block w-full">
            <input
              matNativeControl
              type="password"
              formControlName="password"
              data-testid="password-control"
              [placeholder]="'register.password' | translate"
              required
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error translate="error.password"></mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="mb-2 block w-full">
            <input
              matNativeControl
              type="password"
              formControlName="confirmPassword"
              data-testid="confirm-password-control"
              [placeholder]="'register.confirmPassword' | translate"
              required
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error translate="error.password"></mat-error>
          </mat-form-field>

          @if (registerStatus() === 'error') {
          <mat-error
            translate="error.register"
            data-testid="error-block"
          ></mat-error>
          } @else if(registerStatus() === 'creating'){
          <div
            class="d-flex align-items-center justify-content-center"
            data-testid="pending-block"
          >
            <mat-spinner diameter="50"></mat-spinner>
          </div>
          }
          <button
            mat-raised-button
            class="d-block w-full mt-4"
            color="primary"
            type="submit"
            translate="register.confirm"
            data-testid="submit-button"
            [disabled]="registerStatus() === 'creating'"
          ></button>
        </form>

        <p class="!mt-4 text-center text-sm text-zinc-500">
          <span translate="register.redirectQuestion"></span>
          <a
            translate="register.redirect"
            data-testid="login-link"
            routerLink="/login"
            class="font-semibold leading-6 text-emerald-700 hover:text-emerald-500 ml-2"
          ></a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  registerStatus = input.required<RegisterStatus>();
  @Output() register = new EventEmitter<Credentials>();

  private fb = inject(FormBuilder);

  formGroup = this.fb.nonNullable.group(
    {
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    {
      updateOn: 'blur',
      validators: [passwordMatchesValidator],
    }
  );

  onSubmit() {
    if (this.formGroup.valid) {
      const { confirmPassword, ...credentials } = this.formGroup.getRawValue();
      this.register.emit(credentials);
    }
  }
}
