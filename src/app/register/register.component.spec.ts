import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DebugElement, importProvidersFrom } from '@angular/core';
import { FIREBASE_TEST_PROVIDERS } from '../app.config';
import { AuthService } from '../shared/data-access/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register.component';
import { RegisterService } from './data-access/register.service';

describe('Register Component', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let registerService: RegisterService;

  const registerServiceMock = {
    status: jest.fn(),
    createUser$: {
      next: jest.fn(),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        importProvidersFrom(...FIREBASE_TEST_PROVIDERS),
        {
          provide: RegisterService,
          useValue: registerServiceMock,
        },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(RegisterComponent, {
        remove: { imports: [], providers: [RegisterService] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    registerService = TestBed.inject(RegisterService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('register-form', () => {
    let registerFormComponent: DebugElement;

    beforeEach(() => {
      registerFormComponent = fixture.debugElement.query(
        By.css('app-register-form')
      );
    });

    it('should render register-form component if user is null', () => {
      expect(registerFormComponent).toBeTruthy();
    });

    describe('input: registerStatus', () => {
      it('should use status as an input', () => {
        expect(
          registerFormComponent.componentInstance.registerStatus()
        ).toEqual(registerService.status());
      });
    });

    describe('output: register', () => {
      beforeEach(() => {
        jest.spyOn(registerService.createUser$, 'next');
        registerFormComponent.triggerEventHandler('register', {
          email: 'test@test.com',
          password: 'test',
        });
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(registerService.createUser$.next).toHaveBeenCalled();
      });
    });
  });
});
