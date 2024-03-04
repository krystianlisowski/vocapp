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
          <h2 translate="login.heading"></h2>

          <mat-form-field appearance="outline" class="mb-2">
            <input
              matNativeControl
              [placeholder]="'login.email' | translate"
              formControlName="email"
              type="email"
              required
            />
            <mat-icon matPrefix>mail</mat-icon>
            <mat-error translate="error.email"> </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="mb-2">
            <input
              matNativeControl
              type="password"
              formControlName="password"
              [placeholder]="'login.password' | translate"
              required
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error translate="error.password"> </mat-error>
          </mat-form-field>

          @if (loginStatus() === 'error'){
          <mat-error translate="error.login"></mat-error>
          } @else if(loginStatus() === 'authenticating'){
          <div class="d-flex align-items-center justify-content-center">
            <mat-spinner diameter="50"></mat-spinner>
          </div>
          }

          <div class="text-right mt-4">
            <a
              mat-button
              color="primary"
              routerLink="/register"
              translate="login.redirect"
            ></a>
            <button
              mat-raised-button
              class="ml-2"
              color="primary"
              type="submit"
              translate="login.confirm"
              [disabled]="loginStatus() === 'authenticating'"
            ></button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
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
