import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DebugElement, importProvidersFrom } from '@angular/core';
import { HomeComponent } from './home.component';
import { FIREBASE_TEST_PROVIDERS } from '../app.config';
import { AuthService } from '../shared/data-access/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLessonDialogComponent } from './ui/add-lesson-dialog/add-lesson-dialog.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Lesson } from '../shared/models/lesson.model';
import { Timestamp } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { LessonsService } from './data-acess/lessons.service';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { EditLessonDialogComponent } from './ui/edit-lesson-dialog/edit-lesson-dialog.component';

describe('Home Component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;
  let lessonService: LessonsService;
  let dialog: MatDialog;
  const lessonsMock: Lesson[] = [
    {
      id: 'test',
      title: 'test',
      date: new Timestamp(1, 1),
      studentsCount: 1,
      authorUid: 'test',
    },
  ];

  const authServiceMock = {
    user: jest.fn(),
  };

  const lessonServiceMock = {
    lessons: jest.fn().mockReturnValue(lessonsMock),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        importProvidersFrom(...FIREBASE_TEST_PROVIDERS),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: LessonsService,
          useValue: lessonServiceMock,
        },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    lessonService = TestBed.inject(LessonsService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('page title', () => {
    it('should render a title', () => {
      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement).toBeTruthy();
    });
  });

  describe('add lesson', () => {
    // we want tests to be passed only if user is logged in
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({ emailVerified: true });
    });

    it('should render add lesson button', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement).toBeTruthy();
    });

    it('should open add dialog after button clicked', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      jest.spyOn(dialog, 'open');

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      expect(dialog.open).toHaveBeenCalledWith(AddLessonDialogComponent);
    });
  });

  describe('app-lesson-list', () => {
    let lessonListComponent: DebugElement;

    beforeEach(() => {
      lessonListComponent = fixture.debugElement.query(
        By.css('app-lesson-list')
      );
    });

    describe('input: lessons', () => {
      it('should use lessons array as an input', () => {
        expect(lessonListComponent.componentInstance.lessons()).toEqual(
          lessonsMock
        );
      });
    });

    describe('output: lessonDeleted', () => {
      beforeEach(() => {
        jest.spyOn(dialog, 'open');
        jest.spyOn(component, 'openDeleteDialog');
        lessonListComponent.triggerEventHandler('lessonDeleted', '0');
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(component.openDeleteDialog).toHaveBeenCalledWith('0');
        expect(dialog.open).toHaveBeenCalledWith(DeleteConfirmDialogComponent);
      });
    });

    describe('output: lessonEdited', () => {
      beforeEach(() => {
        jest.spyOn(dialog, 'open');
        jest.spyOn(component, 'openEditDialog');
        lessonListComponent.triggerEventHandler('lessonEdited', lessonsMock[0]);
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(component.openEditDialog).toHaveBeenCalledWith(lessonsMock[0]);
        expect(dialog.open).toHaveBeenCalledWith(EditLessonDialogComponent, {
          data: { lesson: lessonsMock[0] },
        });
      });
    });
  });
});
