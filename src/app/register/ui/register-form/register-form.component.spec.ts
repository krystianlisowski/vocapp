import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { Validators } from '@angular/forms';
import { RegisterFormComponent } from './register-form.component';
import { LoginComponent } from '../../../login/login.component';

describe('Register form Component', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let router: Router;
  const routes = [{ path: 'login', component: LoginComponent }] as Routes;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RegisterFormComponent,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(RegisterFormComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.componentRef.setInput('registerStatus', '');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('form group', () => {
    it('should have email, password and confirm password control', () => {
      const keys = Object.keys(component.formGroup.controls);
      expect(keys).toEqual(['email', 'password', 'confirmPassword']);
    });

    it('should email control have required and email validators', () => {
      expect(
        component.formGroup.controls.email.hasValidator(Validators.required) &&
          component.formGroup.controls.email.hasValidator(Validators.email)
      ).toBeTruthy();
    });

    it('should password and confirm password control have required validator', () => {
      expect(
        component.formGroup.controls.password.hasValidator(
          Validators.required
        ) &&
          component.formGroup.controls.confirmPassword.hasValidator(
            Validators.required
          )
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

    it('should render confirm password control', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="confirm-password-control"]')
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

  describe('input: registerStatus', () => {
    it('should render error block if status is error', () => {
      fixture.componentRef.setInput('registerStatus', 'error');
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(
        By.css('[data-testid="error-block"]')
      );
      expect(errorElement).toBeTruthy();
    });

    it('should render pending block if status is authenticating', () => {
      fixture.componentRef.setInput('registerStatus', 'creating');
      fixture.detectChanges();

      const pendingElement = fixture.debugElement.query(
        By.css('[data-testid="pending-block"]')
      );
      expect(pendingElement).toBeTruthy();
    });

    it('should disable submit button if status is creating', () => {
      fixture.componentRef.setInput('registerStatus', 'creating');
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      expect(buttonElement.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });
  });

  describe('output: register', () => {
    it('should emit register event if credentials are provided corectly', () => {
      component.formGroup.patchValue({
        email: 'test@test.test',
        password: 'test1234',
        confirmPassword: 'test1234',
      });
      fixture.detectChanges();

      jest.spyOn(component.register, 'emit');

      const addButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      addButton.nativeElement.click();

      expect(component.register.emit).toHaveBeenCalled();
    });

    it('should not emit login event if credentials are not provided corectly', () => {
      jest.spyOn(component.register, 'emit');

      const addButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      addButton.nativeElement.click();

      expect(component.register.emit).not.toHaveBeenCalled();
    });
  });

  describe('redirect button', () => {
    it('should redirect after click', () => {
      const redirectElement = fixture.debugElement.query(
        By.css('[data-testid="login-link"]')
      );
      redirectElement.nativeElement.click();

      expect(router.url).toBe('/login');
    });
  });
});
