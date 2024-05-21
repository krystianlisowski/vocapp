import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FIREBASE_TEST_PROVIDERS } from '../app.config';
import { AuthService } from '../shared/data-access/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Timestamp } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { LessonComponent } from './lesson.component';
import { Vocabulary } from '../shared/models/vocabulary.model';
import { EditVocabularyDialogComponent } from './ui/edit-vocabulary-dialog/edit-vocabulary-dialog.component';
import { of } from 'rxjs';
import { VocabularyDetailsService } from './data-acess/vocabulary-details.service';

describe('Lesson Component', () => {
  let component: LessonComponent;
  let fixture: ComponentFixture<LessonComponent>;
  let authService: AuthService;
  let detailsService: VocabularyDetailsService;
  let dialog: MatDialog;

  const vocabularyMock: Vocabulary = {
    id: 'test',
    title: 'string',
    type: 'verb',
    important: false,
    definitions: ['string'],
    lessonDate: new Timestamp(1, 1),
    translation: 'string',
    examples: ['string'],
    links: [{ title: 'string', link: 'string' }],
    authorUid: 'string',
  };

  const authServiceMock = {
    user: jest.fn(),
  };

  const detailsServiceMock = {
    vocabulary: jest.fn().mockReturnValue(vocabularyMock),
    initializeState: jest.fn(),
    remove$: {
      next: jest.fn(),
    },
    edit$: {
      next: jest.fn(),
    },
    add$: {
      next: jest.fn(),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LessonComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        importProvidersFrom(...FIREBASE_TEST_PROVIDERS),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: VocabularyDetailsService,
          useValue: detailsServiceMock,
        },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(LessonComponent, {
        remove: { imports: [], providers: [VocabularyDetailsService] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LessonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'test');
    authService = TestBed.inject(AuthService);
    detailsService = TestBed.inject(VocabularyDetailsService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('page header', () => {
    it('should render a title', () => {
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement).toBeTruthy();
    });

    it('should render a lesson date', () => {
      const dateElement = fixture.debugElement.query(
        By.css('[data-testid="lesson-date"]')
      );
      expect(dateElement).toBeTruthy();
    });

    it('should render a type of speech badge', () => {
      const typeElement = fixture.debugElement.query(
        By.css('[data-testid="type-badge"]')
      );
      expect(typeElement).toBeTruthy();
    });

    it('should not render important badge if important is false', () => {
      const importantElement = fixture.debugElement.query(
        By.css('[data-testid="important-badge"]')
      );
      expect(importantElement).toBeFalsy();
    });
  });

  describe('delete vocabulary', () => {
    const dialogRefMock = {
      afterClosed: jest.fn(() => of('true')),
    } as any;

    // we want tests to be passed only if user is logged in
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({ emailVerified: true });
    });

    beforeEach(() => {
      jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock);
      jest.spyOn(component, 'openDeleteDialog');
      jest.spyOn(detailsService.remove$, 'next');
    });

    it('should render delete vocabulary button', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="delete-button"]')
      );
      expect(buttonElement).toBeTruthy();
    });

    it('should open delete confirm dialog', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="delete-button"]')
      );

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      expect(component.openDeleteDialog).toHaveBeenCalledWith('test');
      expect(dialog.open).toHaveBeenCalledWith(DeleteConfirmDialogComponent);
    });

    it('it should call remove method if dialog was closed with truthy value', () => {
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(detailsService.remove$.next).toHaveBeenCalled();
    });
  });

  describe('edit vocabulary', () => {
    const dialogRefMock = {
      afterClosed: jest.fn(() => of(vocabularyMock)),
    } as any;

    // we want tests to be passed only if user is logged in
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({ emailVerified: true });
    });

    beforeEach(() => {
      jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock);
      jest.spyOn(component, 'openEditDialog');
      jest.spyOn(detailsService.edit$, 'next');
    });

    it('should render edit vocabulary button', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="edit-button"]')
      );
      expect(buttonElement).toBeTruthy();
    });

    it('should open delete confirm dialog', () => {
      const buttonElement = fixture.debugElement.query(
        By.css('[data-testid="edit-button"]')
      );

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      expect(component.openEditDialog).toHaveBeenCalledWith(vocabularyMock);
      expect(dialog.open).toHaveBeenCalledWith(EditVocabularyDialogComponent, {
        data: { phrase: vocabularyMock },
      });
    });

    it('it should call edit method if dialog was closed with truthy value', () => {
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(detailsService.edit$.next).toHaveBeenCalled();
    });
  });

  describe('page main', () => {
    it('should render translation', () => {
      const translationElement = fixture.debugElement.query(
        By.css('[data-testid="translation"]')
      );
      expect(translationElement).toBeTruthy();
    });

    it('should render definitions', () => {
      const definitionsElement = fixture.debugElement.query(
        By.css('[data-testid="definitions"]')
      );
      expect(definitionsElement).toBeTruthy();
    });

    it('should render examples', () => {
      const examplesElement = fixture.debugElement.query(
        By.css('[data-testid="examples"]')
      );
      expect(examplesElement).toBeTruthy();
    });

    it('should render links', () => {
      const linksElement = fixture.debugElement.query(
        By.css('[data-testid="links"]')
      );
      expect(linksElement).toBeTruthy();
    });
  });
});
