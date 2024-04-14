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
import { of } from 'rxjs';

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
    const dialogRefMock = {
      afterClosed: jest.fn(() =>
        of({ title: 'test', date: new Timestamp(1, 1), studentsCount: 1 })
      ),
    } as any;

    // we want tests to be passed only if user is logged in
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({ emailVerified: true });
    });

    beforeEach(() => {
      jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock);
    });

    it('should render add lesson button', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement).toBeTruthy();
    });

    it('should open add dialog after button clicked', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      buttonElement.nativeElement.click();
      fixture.detectChanges();

      expect(dialog.open).toHaveBeenCalledWith(AddLessonDialogComponent);
    });

    it('it should call add method if dialog was closed with lesson object', () => {
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(lessonService.add$.next).toHaveBeenCalled();
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
      const dialogRefMock = {
        afterClosed: jest.fn(() => of('true')),
      } as any;

      beforeEach(() => {
        jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock);
        jest.spyOn(component, 'openDeleteDialog');
        lessonListComponent.triggerEventHandler('lessonDeleted', '0');
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(component.openDeleteDialog).toHaveBeenCalledWith('0');
        expect(dialog.open).toHaveBeenCalledWith(DeleteConfirmDialogComponent);
      });

      it('it should call remove method if dialog was closed with truthy value', () => {
        expect(dialogRefMock.afterClosed).toHaveBeenCalled();
        expect(lessonService.remove$.next).toHaveBeenCalled();
      });
    });

    describe('output: lessonEdited', () => {
      const dialogRefMock = {
        afterClosed: jest.fn(() => of(lessonsMock[0])),
      } as any;

      beforeEach(() => {
        jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock);
        jest.spyOn(component, 'openEditDialog');
        lessonListComponent.triggerEventHandler('lessonEdited', lessonsMock[0]);
        fixture.detectChanges();
      });

      it('should open lesson edit dialog', () => {
        expect(component.openEditDialog).toHaveBeenCalledWith(lessonsMock[0]);
        expect(dialog.open).toHaveBeenCalledWith(EditLessonDialogComponent, {
          data: { lesson: lessonsMock[0] },
        });
      });

      it('it should call edit method if dialog was closed with lesson object', () => {
        expect(dialogRefMock.afterClosed).toHaveBeenCalled();
        expect(lessonService.edit$.next).toHaveBeenCalled();
      });
    });
  });
});
