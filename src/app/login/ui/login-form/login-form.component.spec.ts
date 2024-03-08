import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LoginFormComponent } from './login-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { RegisterComponent } from '../../../register/register.component';
import { Validators } from '@angular/forms';

describe('Login form Component', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let router: Router;
  const routes = [{ path: 'register', component: RegisterComponent }] as Routes;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginFormComponent,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(LoginFormComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.componentRef.setInput('loginStatus', '');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('form group', () => {
    it('should have email and password control', () => {
      const keys = Object.keys(component.formGroup.controls);
      expect(keys).toEqual(['email', 'password']);
    });

    it('should email control have required and email validators', () => {
      expect(
        component.formGroup.controls.email.hasValidator(Validators.required) &&
          component.formGroup.controls.email.hasValidator(Validators.email)
      ).toBeTruthy();
    });

    it('should password control have required validator', () => {
      expect(
        component.formGroup.controls.password.hasValidator(Validators.required)
      ).toBeTruthy();
    });

    it('should render form element', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="form-group"]')
      );
      expect(formElement).toBeTruthy();
    });

    it('should render email control', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="email-control"]')
      );
      expect(formElement).toBeTruthy();
    });

    it('should render password control', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="password-control"]')
      );
      expect(formElement).toBeTruthy();
    });

    it('should render submit button', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      expect(formElement).toBeTruthy();
    });
  });

  describe('input: loginStatus', () => {
    it('should render error block if status is error', () => {
      fixture.componentRef.setInput('loginStatus', 'error');
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(
        By.css('[data-testid="error-block"]')
      );
      expect(errorElement).toBeTruthy();
    });

    it('should render pending block if status is authenticating', () => {
      fixture.componentRef.setInput('loginStatus', 'authenticating');
      fixture.detectChanges();

      const pendingElement = fixture.debugElement.query(
        By.css('[data-testid="pending-block"]')
      );
      expect(pendingElement).toBeTruthy();
    });

    it('should disable submit button if status is authenticating', () => {
      fixture.componentRef.setInput('loginStatus', 'authenticating');
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      expect(buttonElement.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });
  });

  describe('output: login', () => {
    it('should emit login event if credentials are provided corectly', () => {
      component.formGroup.patchValue({
        email: 'test@test.test',
        password: 'test1234',
      });
      fixture.detectChanges();

      jest.spyOn(component.login, 'emit');

      const addButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      addButton.nativeElement.click();

      expect(component.login.emit).toHaveBeenCalled();
    });

    it('should not emit login event if credentials are not provided corectly', () => {
      jest.spyOn(component.login, 'emit');

      const addButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      addButton.nativeElement.click();

      expect(component.login.emit).not.toHaveBeenCalled();
    });
  });

  describe('redirect button', () => {
    it('should redirect after click', () => {
      const redirectElement = fixture.debugElement.query(
        By.css('[data-testid="register-link"]')
      );
      redirectElement.nativeElement.click();

      expect(router.url).toBe('/register');
    });
  });
});
