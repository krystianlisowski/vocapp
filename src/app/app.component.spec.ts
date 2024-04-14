import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { importProvidersFrom } from '@angular/core';
import { FIREBASE_TEST_PROVIDERS } from './app.config';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot(), RouterTestingModule],
      providers: [importProvidersFrom(...FIREBASE_TEST_PROVIDERS)],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
