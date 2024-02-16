import { Pipe, inject, type PipeTransform } from '@angular/core';
import { AuthService } from '../data-access/auth.service';

@Pipe({
  name: 'canWrite',
  standalone: true,
})
export class CanWritePipe implements PipeTransform {
  private authService = inject(AuthService);
  transform<T extends { authorUid: string }>(value: T): boolean {
    return this.authService.user().uid === value.authorUid;
  }
}
