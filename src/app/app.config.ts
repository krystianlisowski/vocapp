import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  provideAuth,
} from '@angular/fire/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { Capacitor } from '@capacitor/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const FIREBASE_TEST_PROVIDERS = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => {
        if (Capacitor.isNativePlatform()) {
          return initializeAuth(getApp(), {
            persistence: indexedDBLocalPersistence,
          });
        } else {
          const auth = getAuth();
          if (environment.useEmulators) {
            connectAuthEmulator(auth, 'http://localhost:9099', {
              disableWarnings: true,
            });
          }
          return auth;
        }
      }),
      provideFirestore(() => {
        let firestore: Firestore;
        if (environment.useEmulators) {
          firestore = initializeFirestore(getApp(), {});
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        } else {
          firestore = getFirestore();
        }
        return firestore;
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: 'en',
      })
    ),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { width: '1024px' } },
    provideAnimationsAsync(),
  ],
};
