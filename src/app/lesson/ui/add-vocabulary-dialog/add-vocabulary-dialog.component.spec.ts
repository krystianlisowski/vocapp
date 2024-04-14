import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddVocabularyDialogComponent } from './add-vocabulary-dialog.component';
import { DebugElement } from '@angular/core';

describe('Add vocabulary item dialog Component', () => {
  let component: AddVocabularyDialogComponent;
  let fixture: ComponentFixture<AddVocabularyDialogComponent>;
  let dialogRef: MatDialogRef<AddVocabularyDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddVocabularyDialogComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
      ],
    })
      .overrideComponent(AddVocabularyDialogComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddVocabularyDialogComponent);
    dialogRef = TestBed.inject(MatDialogRef<AddVocabularyDialogComponent>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('dialog title', () => {
    it('should render a title', () => {
      const titleElement = fixture.debugElement.query(
        By.css('[data-testid="dialog-title"]')
      );
      expect(titleElement).toBeTruthy();
    });
  });

  describe('form group', () => {
    it('should have title, date and studentsCount control', () => {
      const keys = Object.keys(component.formGroup.controls);
      expect(keys).toEqual([
        'title',
        'translation',
        'definition',
        'examples',
        'links',
      ]);
    });

    it('should controls have required validator', () => {
      expect(
        component.formGroup.controls.title.hasValidator(Validators.required) &&
          component.formGroup.controls.translation.hasValidator(
            Validators.required
          ) &&
          component.formGroup.controls.definition.hasValidator(
            Validators.required
          )
      ).toBeTruthy();
    });

    it('should disable submit button if form is not valid', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      expect(buttonElement.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });

    it('should render form element', () => {
      const formElement = fixture.debugElement.query(
        By.css('[data-testid="form-group"]')
      );
      expect(formElement).toBeTruthy();
    });

    it('should render title control', () => {
      const titleControl = fixture.debugElement.query(
        By.css('[data-testid="title-control"]')
      );
      expect(titleControl).toBeTruthy();
    });

    it('should render translation control', () => {
      const translationControl = fixture.debugElement.query(
        By.css('[data-testid="translation-control"]')
      );
      expect(translationControl).toBeTruthy();
    });

    it('should render definition control', () => {
      const definitionControl = fixture.debugElement.query(
        By.css('[data-testid="definition-control"]')
      );
      expect(definitionControl).toBeTruthy();
    });

    it('should render examples array', () => {
      const examplesArray = fixture.debugElement.query(
        By.css('app-form-array-control')
      );
      expect(examplesArray).toBeTruthy();
    });

    it('should render links array', () => {
      const linksArray = fixture.debugElement.query(
        By.css('app-form-array-group')
      );
      expect(linksArray).toBeTruthy();
    });

    it('should render close button', () => {
      const closeButton = fixture.debugElement.query(
        By.css('[data-testid="close-button"]')
      );
      expect(closeButton).toBeTruthy();
    });

    it('should render submit button', () => {
      const submitButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      expect(submitButton).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('should close modal after button click', () => {
      jest.spyOn(dialogRef, 'close');
      const closeButton = fixture.debugElement.query(
        By.css('[data-testid="close-button"]')
      );
      closeButton.nativeElement.click();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close modal with form data after save button click only if form is valid', () => {
      const testData = {
        title: 'test',
        translation: 'test',
        definition: 'test',
        examples: [],
        links: [],
      };
      component.formGroup.patchValue(testData);
      fixture.detectChanges();

      jest.spyOn(dialogRef, 'close');

      const submitButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      submitButton.nativeElement.click();

      expect(dialogRef.close).toHaveBeenCalledWith(testData);
    });
  });

  describe('examples form array', () => {
    let formArrayComponent: DebugElement;

    beforeEach(() => {
      formArrayComponent = fixture.debugElement.query(
        By.css('app-form-array-control')
      );
    });

    describe('input: formArray', () => {
      it('should use examples form array selector as input', () => {
        expect(formArrayComponent.componentInstance.formArray()).toEqual(
          component.formGroup.controls.examples
        );
      });
    });

    describe('input: arrayLabel', () => {
      it('should use string as input', () => {
        expect(formArrayComponent.componentInstance.arrayLabel()).toEqual(
          'vocabulary.examples'
        );
      });
    });

    describe('input: controlLabel', () => {
      it('should use string as input', () => {
        expect(formArrayComponent.componentInstance.controlLabel()).toEqual(
          'vocabulary.example'
        );
      });
    });

    describe('output: addItem', () => {
      beforeEach(() => {
        jest.spyOn(component, 'addExample');
        formArrayComponent.triggerEventHandler('addItem');
        fixture.detectChanges();
      });

      it('should call addExample method', () => {
        expect(component.addExample).toHaveBeenCalled();
      });
    });

    describe('output: deleteItem', () => {
      beforeEach(() => {
        jest.spyOn(component, 'deleteItem');
        formArrayComponent.triggerEventHandler('deleteItem', 0);
        fixture.detectChanges();
      });

      it('should call deleteItem method', () => {
        expect(component.deleteItem).toHaveBeenCalledWith('examples', 0);
      });
    });
  });

  describe('links form array', () => {
    let formArrayComponent: DebugElement;

    beforeEach(() => {
      formArrayComponent = fixture.debugElement.query(
        By.css('app-form-array-group')
      );
    });

    describe('input: formArray', () => {
      it('should use links form array selector as input', () => {
        expect(formArrayComponent.componentInstance.formArray()).toEqual(
          component.formGroup.controls.links
        );
      });
    });

    describe('input: arrayLabel', () => {
      it('should use string as input', () => {
        expect(formArrayComponent.componentInstance.arrayLabel()).toEqual(
          'vocabulary.links'
        );
      });
    });

    describe('output: addItem', () => {
      beforeEach(() => {
        jest.spyOn(component, 'addLink');
        formArrayComponent.triggerEventHandler('addItem');
        fixture.detectChanges();
      });

      it('should call addLink method', () => {
        expect(component.addLink).toHaveBeenCalled();
      });
    });

    describe('output: deleteItem', () => {
      beforeEach(() => {
        jest.spyOn(component, 'deleteItem');
        formArrayComponent.triggerEventHandler('deleteItem', 0);
        fixture.detectChanges();
      });

      it('should call deleteItem method', () => {
        expect(component.deleteItem).toHaveBeenCalledWith('links', 0);
      });
    });
  });
});
