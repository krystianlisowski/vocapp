import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { LoginService } from './data-access/login.service';
import { AuthService } from '../shared/data-access/auth.service';
import { LoginFormComponent } from './ui/login-form/login-form.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { StoredUrlService } from '../shared/utils/stored-url.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent, MatProgressSpinner],
  template: `
    <div class="flex justify-center items-center my-5">
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
  private urlStore = inject(StoredUrlService);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.urlStore.navigateToStoredUrl();
      }
    });
  }
}
