import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StoredUrlService {
  private router = inject(Router);

  previousUrlKey = 'previousUrl';

  storeUrl(url: string): void {
    sessionStorage.setItem(this.previousUrlKey, url);
  }

  getUrl(): string | null | undefined {
    return sessionStorage.getItem(this.previousUrlKey);
  }

  clearUrl(): void {
    sessionStorage.removeItem(this.previousUrlKey);
  }

  navigateToStoredUrl(): void {
    const previousUrl = this.getUrl();
    if (previousUrl) {
      this.router.navigateByUrl(previousUrl);
      this.clearUrl();
      return;
    }
    this.router.navigate(['/']);
  }
}
