import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { importProvidersFrom } from '@angular/core';
import { FIREBASE_TEST_PROVIDERS } from '../../../app.config';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';

describe('Header Component', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let authService: AuthService;
  const authServiceMock = {
    user: jest.fn(),
    verificationEmailSent: jest.fn(),
    logout: jest.fn(),
    emailVerification$: {
      next: jest.fn(),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        provideNoopAnimations(),
        importProvidersFrom(...FIREBASE_TEST_PROVIDERS),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    })
      .overrideComponent(HeaderComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('app logo', () => {
    it('should render a logo', () => {
      const logoElement = fixture.debugElement.query(By.css('.logo'));
      expect(logoElement).toBeTruthy();
    });

    it('should navigate after logo click', () => {
      const logoElement = fixture.debugElement.query(By.css('.logo'));
      logoElement.nativeElement.click();

      expect(router.navigated).toEqual(true);
    });
  });

  describe('authenticated user dropdown', () => {
    // we want tests to be passed only if user is logged in
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({});
    });

    it('should render user button', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="user-button"]')
      );
      expect(buttonElement).toBeTruthy();
    });

    it('should render actions list aftrer click button', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="user-button"]')
      );
      buttonElement.nativeElement.click();

      const actionsElement = fixture.debugElement.query(
        By.css('[data-testid="action-list"]')
      );
      expect(actionsElement).toBeTruthy();
    });

    it('should logout user after click button', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="user-button"]')
      );
      buttonElement.nativeElement.click();

      const optionElement = fixture.debugElement.query(
        By.css('[data-testid="action-button"]')
      );

      optionElement.nativeElement.click();

      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('email verification banner', () => {
    // we want tests to be passed only if user is logged in and email was not verified
    beforeEach(() => {
      authServiceMock.user.mockReturnValue({ emailVerified: false });
      authServiceMock.verificationEmailSent
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
    });

    it('should render verification-banner', () => {
      const bannerElement = fixture.debugElement.query(
        By.css('[data-testid="verification-banner"]')
      );
      expect(bannerElement).toBeTruthy();
    });

    it('should render success icon if email was sent', () => {
      const iconElement = fixture.debugElement.query(
        By.css('[data-testid="send-success-icon"]')
      );

      expect(iconElement).toBeTruthy();
    });

    it('should disable send email button if email was sent', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="send-link-button"]')
      );
      expect(buttonElement.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });

    it('should emit send email event after click button', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="send-link-button"]')
      );
      buttonElement.nativeElement.click();

      expect(authService.emailVerification$.next).toHaveBeenCalled();
    });
  });
});
