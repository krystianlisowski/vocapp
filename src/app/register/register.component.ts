import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { RegisterService } from './data-access/register.service';
import { AuthService } from '../shared/data-access/auth.service';
import { RegisterFormComponent } from './ui/register-form/register-form.component';
import { StoredUrlService } from '../shared/utils/stored-url.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegisterFormComponent],
  template: `
    <div class="d-flex justify-content-center align-items-center my-5">
      <app-register-form
        [registerStatus]="registerService.status()"
        (register)="registerService.createUser$.next($event)"
      />
    </div>
  `,
  providers: [RegisterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  registerService = inject(RegisterService);
  private authService = inject(AuthService);
  private urlStore = inject(StoredUrlService);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.urlStore.navigateToStoredUrl();
      }
    });
  }
}
