import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-header></app-header>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent {}
