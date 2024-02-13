import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
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
    <mat-card class="form-window">
      <mat-card-content>
        <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
          <h2 translate="register.heading"></h2>

          <mat-form-field appearance="outline" class="mb-2">
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

          <mat-form-field appearance="outline" class="mb-2">
            <input
              matNativeControl
              type="password"
              formControlName="password"
              [placeholder]="'register.password' | translate"
              required
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error translate="error.password"></mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="mb-2">
            <input
              matNativeControl
              type="password"
              formControlName="confirmPassword"
              [placeholder]="'register.confirmPassword' | translate"
              required
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error translate="error.password"></mat-error>
          </mat-form-field>

          @if (registerStatus === 'error') {
          <mat-error translate="error.register"></mat-error>
          } @else if(registerStatus === 'creating'){
          <div class="d-flex align-items-center justify-content-center">
            <mat-spinner diameter="50"></mat-spinner>
          </div>
          }

          <div class="text-right mt-4">
            <a
              mat-button
              color="primary"
              routerLink="/login"
              translate="register.redirect"
            ></a>
            <button
              mat-raised-button
              class="ml-3"
              color="primary"
              type="submit"
              translate="register.confirm"
              [disabled]="registerStatus === 'creating'"
            ></button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  @Input({ required: true }) registerStatus!: RegisterStatus;
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
