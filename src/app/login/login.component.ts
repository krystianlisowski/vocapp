import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { LoginService } from './data-access/login.service';
import { AuthService } from '../shared/data-access/auth.service';
import { Router } from '@angular/router';
import { LoginFormComponent } from './ui/login-form/login-form.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent, MatProgressSpinner],
  template: `
    <div class="d-flex justify-content-center align-items-center my-5">
      @if(authService.user() === null){
      <app-login-form
        [loginStatus]="loginService.status()"
        (login)="loginService.login$.next($event)"
      />
      } @else {
      <mat-spinner diameter="50" />
      }
    </div>
  `,
  providers: [LoginService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public loginService = inject(LoginService);
  public authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['']);
      }
    });
  }
}
