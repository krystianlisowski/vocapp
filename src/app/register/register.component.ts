import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { RegisterService } from './data-access/register.service';
import { AuthService } from '../shared/data-access/auth.service';
import { Router } from '@angular/router';
import { RegisterFormComponent } from './ui/register-form/register-form.component';

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
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['']);
      }
    });
  }
}
