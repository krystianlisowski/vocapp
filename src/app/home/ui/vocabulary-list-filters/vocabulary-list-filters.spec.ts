import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FIREBASE_TEST_PROVIDERS } from '../../../app.config';
import { RouterTestingModule } from '@angular/router/testing';
import { VocabularyListFiltersComponent } from './vocabulary-list-filters.component';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('Vocabulary list Filters Component', () => {
  let component: VocabularyListFiltersComponent;
  let fixture: ComponentFixture<VocabularyListFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        VocabularyListFiltersComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        importProvidersFrom(...FIREBASE_TEST_PROVIDERS),
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(VocabularyListFiltersComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(VocabularyListFiltersComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('form controls', () => {
    it('should have form group with proper controls', () => {
      const keys = Object.keys(component.formGroup.controls);
      expect(keys).toEqual(['title', 'type', 'lessonDate', 'important']);
    });

    it('should render form element', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="form-group"]')
      );
      expect(formElement).toBeTruthy();
    });

    it('should render title control element', () => {
      const titleControlElement = fixture.debugElement.query(
        By.css('[data-testid="title-control"]')
      );
      expect(titleControlElement).toBeTruthy();
    });

    it('should render type control element', () => {
      const typeControlElement = fixture.debugElement.query(
        By.css('[data-testid="type-control"]')
      );
      expect(typeControlElement).toBeTruthy();
    });

    it('should render date cotrol element', () => {
      const dateControlElement = fixture.debugElement.query(
        By.css('[data-testid="date-control"]')
      );
      expect(dateControlElement).toBeTruthy();
    });

    it('should render important control element', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="important-control"]')
      );
      expect(formElement).toBeTruthy();
    });
  });

  describe('reset button', () => {
    beforeEach(() => {
      component.formGroup.patchValue({ type: 'verb' });
      fixture.detectChanges();
    });

    it('should render form element', () => {
      const resetButton = fixture.debugElement.query(
        By.css('[data-testid="reset-button"]')
      );

      expect(resetButton).toBeTruthy();
    });
  });

  describe('output: filtersChanged', () => {
    beforeEach(() => {
      jest.spyOn(component.filtersChanged, 'emit');
      component.formGroup.patchValue({ type: 'verb' });
      fixture.detectChanges();
    });

    it('should emit value after form change', () => {
      expect(component.filtersChanged.emit).toHaveBeenCalled();
    });
  });
});
