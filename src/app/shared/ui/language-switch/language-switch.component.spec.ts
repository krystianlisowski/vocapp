import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitchComponent } from './language-switch.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('Language Switch Component', () => {
  let component: LanguageSwitchComponent;
  let fixture: ComponentFixture<LanguageSwitchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LanguageSwitchComponent, TranslateModule.forRoot()],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(LanguageSwitchComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render switch button', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('[data-testid="switch-button"]')
    );
    expect(buttonElement).toBeTruthy();
  });

  it('should render languages list aftrer click button', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('[data-testid="switch-button"]')
    );
    buttonElement.nativeElement.click();

    const listElement = fixture.debugElement.query(
      By.css('[data-testid="language-list"]')
    );
    expect(listElement).toBeTruthy();
  });

  it('should emit change language aftrer click list element', () => {
    jest.spyOn(component.translateService, 'use');
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(
      By.css('[data-testid="switch-button"]')
    );
    buttonElement.nativeElement.click();

    const optionElement = fixture.debugElement.query(
      By.css('[data-testid="language-option-button"]')
    );

    optionElement.nativeElement.click();

    expect(component.translateService.use).toHaveBeenCalled();
  });
});
