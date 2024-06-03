import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <div class="container border-t border-zinc-200 py-4">
        <div
          class="w-full flex items-center justify-center flex-col text-zinc-500 gap-1"
        >
          <p class="text-sm">© 2024 Codease Krystian Lisowski.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
