import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FIREBASE_TEST_PROVIDERS } from '../../../app.config';
import { By } from '@angular/platform-browser';
import {
  CanWritePipe,
  MockCanWritePipe,
} from '../../../shared/pipes/can-write.pipe';
import { LessonListComponent } from './lesson-list.component';
import { Lesson } from '../../../shared/models/lesson.model';
import { Timestamp } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';

describe('Lesson list Component', () => {
  let component: LessonListComponent;
  let fixture: ComponentFixture<LessonListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LessonListComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [importProvidersFrom(...FIREBASE_TEST_PROVIDERS)],
    })
      .overrideComponent(LessonListComponent, {
        remove: { imports: [CanWritePipe] },
        add: { imports: [MockCanWritePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LessonListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('lessons', []);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('input: lessons', () => {
    it('should render datatable', () => {
      fixture.componentRef.setInput('lessons', []);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('app-datatable')
      );

      expect(actionsElement).toBeTruthy();
    });

    it('should render some of actions buttons if user is author of that lesson', () => {
      const testLessons: Lesson[] = [
        {
          id: 'uid',
          title: 'string',
          date: new Timestamp(1, 1),
          studentsCount: 1,
          authorUid: 'uid',
        },
      ];
      fixture.componentRef.setInput('lessons', testLessons);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('[data-testid="delete-lesson-button"]')
      );

      expect(actionsElement).toBeTruthy();
    });

    it('should not render any of actions buttons if user is not author of that lesson', () => {
      fixture.componentRef.setInput('lessons', []);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('[data-testid="delete-lesson-button"]')
      );

      expect(actionsElement).toBeFalsy();
    });
  });

  describe('output: lessonDeleted', () => {
    it('should emit lesson id to be deleted', () => {
      const testLessons: Lesson[] = [
        {
          id: 'uid',
          title: 'string',
          date: new Timestamp(1, 1),
          studentsCount: 1,
          authorUid: 'uid',
        },
      ];
      fixture.componentRef.setInput('lessons', testLessons);
      fixture.detectChanges();

      jest.spyOn(component.lessonDeleted, 'emit');

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-lesson-button"]')
      );
      deleteButton.nativeElement.click();

      expect(component.lessonDeleted.emit).toHaveBeenCalledWith(
        testLessons[0].id
      );
    });
  });

  describe('output: lessonEdited', () => {
    it('should emit lesson id to be deleted', () => {
      const testLessons: Lesson[] = [
        {
          id: 'uid',
          title: 'string',
          date: new Timestamp(1, 1),
          studentsCount: 1,
          authorUid: 'uid',
        },
      ];
      fixture.componentRef.setInput('lessons', testLessons);
      fixture.detectChanges();

      jest.spyOn(component.lessonEdited, 'emit');

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="edit-lesson-button"]')
      );
      deleteButton.nativeElement.click();

      expect(component.lessonEdited.emit).toHaveBeenCalledWith(testLessons[0]);
    });
  });
});
