import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-header></app-header>

    <div class="container max-sm:mt-32 max-sm:mb-12">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent {}
