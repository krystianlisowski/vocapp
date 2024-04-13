import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DebugElement, importProvidersFrom } from '@angular/core';
import { FIREBASE_TEST_PROVIDERS } from '../app.config';
import { AuthService } from '../shared/data-access/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Timestamp } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { LessonComponent } from './lesson.component';
import { AddVocabularyDialogComponent } from './ui/add-vocabulary-dialog/add-vocabulary-dialog.component';
import { Vocabulary } from '../shared/models/vocabulary.model';
import { LessonService } from './data-acess/lesson.service';
import { Lesson } from '../shared/models/lesson.model';
import { EditVocabularyDialogComponent } from './ui/edit-vocabulary-dialog/edit-vocabulary-dialog.component';

describe('Lesson Component', () => {
  let component: LessonComponent;
  let fixture: ComponentFixture<LessonComponent>;
  let authService: AuthService;
  let lessonService: LessonService;
  let dialog: MatDialog;
  const vocabularyMock: Vocabulary[] = [
    {
      id: 'test',
      title: 'string',
      definition: 'string',
      translation: 'string',
      examples: [],
      links: [],
      authorUid: 'string',
    },
  ];

  const lessonMock: Lesson = {
    id: 'test',
    title: 'test',
    date: new Timestamp(1, 1),
    studentsCount: 1,
    authorUid: 'test',
  };

  const authServiceMock = {
    user: jest.fn(),
  };

  const lessonServiceMock = {
    vocabulary: jest.fn().mockReturnValue(vocabularyMock),
    lesson: jest.fn().mockReturnValue(lessonMock),
    initializeState: jest.fn(),
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
          provide: LessonService,
          useValue: lessonServiceMock,
        },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(LessonComponent, {
        remove: { imports: [], providers: [LessonService] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LessonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'test');
    authService = TestBed.inject(AuthService);
    lessonService = TestBed.inject(LessonService);
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
  });

  describe('add vocabulary', () => {
    // we want tests to be passed only if user is logged in
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({ emailVerified: true });
    });

    it('should render add vocabulary button', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement).toBeTruthy();
    });

    it('should open add dialog after button clicked', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      jest.spyOn(dialog, 'open');
      jest.spyOn(component, 'openAddDialog');

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      expect(component.openAddDialog).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(AddVocabularyDialogComponent);
    });
  });

  describe('Vocabulary list', () => {
    let vocabularyItemComponent: DebugElement;

    beforeEach(() => {
      vocabularyItemComponent = fixture.debugElement.query(
        By.css('app-vocabulary-item')
      );
    });

    it('should render a list item for each element', () => {
      fixture.detectChanges();
      const result = fixture.debugElement.queryAll(
        By.css('app-vocabulary-item')
      );
      expect(result.length).toEqual(lessonService.vocabulary().length);
    });

    describe('input: lesson', () => {
      it('should use vocabulary object as an input', () => {
        expect(vocabularyItemComponent.componentInstance.item()).toEqual(
          vocabularyMock[0]
        );
      });
    });

    describe('output: itemDeleted', () => {
      beforeEach(() => {
        jest.spyOn(dialog, 'open');
        jest.spyOn(component, 'openDeleteDialog');

        vocabularyItemComponent.triggerEventHandler('itemDeleted', '0');
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(component.openDeleteDialog).toHaveBeenCalledWith('0');
        expect(dialog.open).toHaveBeenCalledWith(DeleteConfirmDialogComponent);
      });
    });

    describe('output: itemEdited', () => {
      beforeEach(() => {
        jest.spyOn(dialog, 'open');
        jest.spyOn(component, 'openEditDialog');
        vocabularyItemComponent.triggerEventHandler(
          'itemEdited',
          vocabularyMock[0]
        );
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(component.openEditDialog).toHaveBeenCalledWith(
          vocabularyMock[0]
        );
        expect(dialog.open).toHaveBeenCalledWith(
          EditVocabularyDialogComponent,
          {
            data: { phrase: vocabularyMock[0] },
          }
        );
      });
    });
  });
});
