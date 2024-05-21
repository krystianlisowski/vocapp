import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FIREBASE_TEST_PROVIDERS } from '../../../app.config';
import { By } from '@angular/platform-browser';
import {
  CanWritePipe,
  MockCanWritePipe,
} from '../../../shared/pipes/can-write.pipe';
import { VocabularyListComponent } from './vocabualry-list.component';
import { Timestamp } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { VocabularyListItem } from '../../../shared/models/vocabulary.model';

describe('Vocabulary list Component', () => {
  let component: VocabularyListComponent;
  let fixture: ComponentFixture<VocabularyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        VocabularyListComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [importProvidersFrom(...FIREBASE_TEST_PROVIDERS)],
    })
      .overrideComponent(VocabularyListComponent, {
        remove: { imports: [CanWritePipe] },
        add: { imports: [MockCanWritePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(VocabularyListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('vocabulary', []);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('input: vocabulary', () => {
    it('should render datatable', () => {
      fixture.componentRef.setInput('vocabulary', []);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('app-datatable')
      );

      expect(actionsElement).toBeTruthy();
    });

    it('should render some of actions buttons if user is author of that vocabulary item', () => {
      const testListItems: VocabularyListItem[] = [
        {
          id: 'uid',
          title: 'string',
          lessonDate: new Timestamp(1, 1),
          type: 'noun',
          important: false,
          authorUid: 'uid',
        },
      ];
      fixture.componentRef.setInput('vocabulary', testListItems);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('[data-testid="delete-vocabulary-button"]')
      );

      expect(actionsElement).toBeTruthy();
    });

    it('should not render any of actions buttons if user is not author of that vocabulary item', () => {
      fixture.componentRef.setInput('vocabulary', []);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('[data-testid="delete-vocabulary-button"]')
      );

      expect(actionsElement).toBeFalsy();
    });
  });

  describe('output: vocabularyDeleted', () => {
    it('should emit vocabulary id to be deleted', () => {
      const testListItems: VocabularyListItem[] = [
        {
          id: 'uid',
          title: 'string',
          lessonDate: new Timestamp(1, 1),
          type: 'verb',
          important: false,
          authorUid: 'uid',
        },
      ];
      fixture.componentRef.setInput('vocabulary', testListItems);
      fixture.detectChanges();

      jest.spyOn(component.vocabularyDeleted, 'emit');

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-vocabulary-button"]')
      );
      deleteButton.nativeElement.click();

      expect(component.vocabularyDeleted.emit).toHaveBeenCalledWith(
        testListItems[0].id
      );
    });
  });
});
