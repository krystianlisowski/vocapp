import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Validators } from '@angular/forms';
import { AddLessonDialogComponent } from './add-lesson-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import dayjs from 'dayjs';

describe('Register form Component', () => {
  let component: AddLessonDialogComponent;
  let fixture: ComponentFixture<AddLessonDialogComponent>;
  let dialogRef: MatDialogRef<AddLessonDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddLessonDialogComponent, TranslateModule.forRoot()],
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
      .overrideComponent(AddLessonDialogComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddLessonDialogComponent);
    dialogRef = TestBed.inject(MatDialogRef<AddLessonDialogComponent>);
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
      expect(keys).toEqual(['title', 'date', 'studentsCount']);
    });

    it('should controls have required validator', () => {
      expect(
        component.formGroup.controls.title.hasValidator(Validators.required) &&
          component.formGroup.controls.date.hasValidator(Validators.required) &&
          component.formGroup.controls.studentsCount.hasValidator(
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

    it('should render date control', () => {
      const dateControl = fixture.debugElement.query(
        By.css('[data-testid="date-control"]')
      );
      expect(dateControl).toBeTruthy();
    });

    it('should render studentsCount control', () => {
      const studentsControl = fixture.debugElement.query(
        By.css('[data-testid="students-control"]')
      );
      expect(studentsControl).toBeTruthy();
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
        date: dayjs().format(),
        studentsCount: 4,
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
});
