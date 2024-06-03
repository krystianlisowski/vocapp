import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { FooterComponent } from './shared/ui/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-header></app-header>

    <div class="container max-sm:mt-24 max-sm:mb-12 flex-1">
      <router-outlet></router-outlet>
    </div>

    <app-footer></app-footer>
  `,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class AppComponent {}
