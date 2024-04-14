import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DebugElement, importProvidersFrom } from '@angular/core';
import { FIREBASE_TEST_PROVIDERS } from '../app.config';
import { AuthService } from '../shared/data-access/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from './data-access/login.service';
import { LoginComponent } from './login.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LoginFormComponent } from './ui/login-form/login-form.component';

describe('Login Component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let loginService: LoginService;

  const authServiceMock = {
    user: jest.fn().mockReturnValue(null),
  };

  const loginServiceMock = {
    status: jest.fn(),
    login$: {
      next: jest.fn(),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        importProvidersFrom(...FIREBASE_TEST_PROVIDERS),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: LoginService,
          useValue: loginServiceMock,
        },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(LoginComponent, {
        remove: { imports: [], providers: [LoginService] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    loginService = TestBed.inject(LoginService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('login-form', () => {
    let loginFormComponent: DebugElement;

    beforeEach(() => {
      loginFormComponent = fixture.debugElement.query(By.css('app-login-form'));
    });

    it('should render login-form component if user is null', () => {
      expect(loginFormComponent).toBeTruthy();
    });

    describe('input: lessonStatus', () => {
      it('should use status as an input', () => {
        expect(loginFormComponent.componentInstance.loginStatus()).toEqual(
          loginService.status()
        );
      });
    });

    describe('output: login', () => {
      beforeEach(() => {
        jest.spyOn(loginService.login$, 'next');
        loginFormComponent.triggerEventHandler('login', {
          email: 'test@test.com',
          password: 'test',
        });
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(loginService.login$.next).toHaveBeenCalled();
      });
    });
  });

  describe('spinner compnent', () => {
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({});
    });

    it('should render mat-spinner if user is not null', () => {
      const formElement = fixture.debugElement.query(By.css('app-login-form'));
      const spinnerElement = fixture.debugElement.query(By.css('mat-spinner'));
      expect(spinnerElement).toBeTruthy();
      expect(formElement).toBeFalsy();
    });
  });
});
