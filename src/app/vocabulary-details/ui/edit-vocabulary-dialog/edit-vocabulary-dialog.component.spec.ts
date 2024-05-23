import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DebugElement } from '@angular/core';
import { EditVocabularyDialogComponent } from './edit-vocabulary-dialog.component';
import { Timestamp } from '@angular/fire/firestore';
import dayjs from 'dayjs';
import { VocabularyType } from '../../data-acess/dictionary.service';

describe('Edit vocabulary item dialog Component', () => {
  let component: EditVocabularyDialogComponent;
  let fixture: ComponentFixture<EditVocabularyDialogComponent>;
  let dialogRef: MatDialogRef<EditVocabularyDialogComponent>;
  const vocabularyItemMock = {
    title: 'test',
    type: 'verb' as VocabularyType,
    definitions: ['test'],
    translation: 'test',
    lessonDate: new Timestamp(1, 1),
    important: false,
    examples: ['test'],
    links: [{ title: 'test', link: 'test' }],
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditVocabularyDialogComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { phrase: vocabularyItemMock },
        },
      ],
    })
      .overrideComponent(EditVocabularyDialogComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EditVocabularyDialogComponent);
    dialogRef = TestBed.inject(MatDialogRef<EditVocabularyDialogComponent>);
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
    it('should have proper controls', () => {
      const keys = Object.keys(component.formGroup.controls);
      expect(keys).toEqual([
        'title',
        'type',
        'translation',
        'definitions',
        'lessonDate',
        'important',
        'examples',
        'links',
      ]);
    });

    it('should controls have proper validators', () => {
      expect(
        component.formGroup.controls.title.hasValidator(Validators.required) &&
          component.formGroup.controls.translation.hasValidator(
            Validators.required
          )
      ).toBeTruthy();
    });

    it('should disable submit button if form is not valid', () => {
      component.formGroup.controls.title.setValue('');
      fixture.detectChanges();

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

    it('should render definitions array', () => {
      const definitionsArray = fixture.debugElement.query(
        By.css('[data-testid="definitions-array"]')
      );
      expect(definitionsArray).toBeTruthy();
    });

    it('should render examples array', () => {
      const examplesArray = fixture.debugElement.query(
        By.css('[data-testid="examples-array"]')
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
      const mock = {
        ...vocabularyItemMock,
        lessonDate: dayjs().format(),
      };

      component.formGroup.patchValue(mock);
      fixture.detectChanges();

      jest.spyOn(dialogRef, 'close');

      const submitButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      submitButton.nativeElement.click();

      expect(dialogRef.close).toHaveBeenCalledWith(mock);
    });
  });

  describe('examples form array', () => {
    let formArrayComponent: DebugElement;

    beforeEach(() => {
      formArrayComponent = fixture.debugElement.query(
        By.css('[data-testid="examples-array"]')
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
