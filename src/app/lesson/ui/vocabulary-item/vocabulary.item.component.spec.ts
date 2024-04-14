import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VocabularyItemComponent } from './vocabulary-item.component';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FIREBASE_TEST_PROVIDERS } from '../../../app.config';
import { By } from '@angular/platform-browser';
import {
  CanWritePipe,
  MockCanWritePipe,
} from '../../../shared/pipes/can-write.pipe';

describe('Vocabulary Item Component', () => {
  let component: VocabularyItemComponent;
  let fixture: ComponentFixture<VocabularyItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VocabularyItemComponent, TranslateModule.forRoot()],
      providers: [importProvidersFrom(...FIREBASE_TEST_PROVIDERS)],
    })
      .overrideComponent(VocabularyItemComponent, {
        remove: { imports: [CanWritePipe] },
        add: { imports: [MockCanWritePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(VocabularyItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('item', {
      id: 'uid',
      title: 'string',
      definition: 'string',
      translation: 'string',
      examples: [],
      links: [],
      authorUid: 'string',
    });

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('input: item', () => {
    it('should render actions block if user is author of that vocabulary', () => {
      const testItem = {
        id: 'uid',
        title: 'string',
        definition: 'string',
        translation: 'string',
        examples: [],
        links: [],
        authorUid: 'uid',
      };
      fixture.componentRef.setInput('item', testItem);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('[data-testid="vocabulary-item-actions"]')
      );

      expect(actionsElement).toBeTruthy();
    });

    it('should not render actions block if user is author of that vocabulary', () => {
      const testItem = {
        id: 'uid',
        title: 'string',
        definition: 'string',
        translation: 'string',
        examples: [],
        links: [],
        authorUid: 'anotherUid',
      };
      fixture.componentRef.setInput('item', testItem);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(
        By.css('[data-testid="vocabulary-item-actions"]')
      );

      expect(actionsElement).toBeFalsy();
    });
  });

  describe('output: itemDeleted', () => {
    it('should emit vocabulary item id to be deleted', () => {
      const testItem = {
        id: 'uid',
        title: 'string',
        definition: 'string',
        translation: 'string',
        examples: [],
        links: [],
        authorUid: 'uid',
      };
      fixture.componentRef.setInput('item', testItem);
      fixture.detectChanges();

      jest.spyOn(component.itemDeleted, 'emit');

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-vocabulary-item-button"]')
      );
      deleteButton.nativeElement.click();

      expect(component.itemDeleted.emit).toHaveBeenCalledWith(testItem.id);
    });
  });

  describe('output: itemEdited', () => {
    it('should emit vocabulary item to be edited', () => {
      const testItem = {
        id: 'uid',
        title: 'string',
        definition: 'string',
        translation: 'string',
        examples: [],
        links: [],
        authorUid: 'uid',
      };
      fixture.componentRef.setInput('item', testItem);
      fixture.detectChanges();

      jest.spyOn(component.itemEdited, 'emit');

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="edit-vocabulary-item-button"]')
      );
      deleteButton.nativeElement.click();

      expect(component.itemEdited.emit).toHaveBeenCalledWith(testItem);
    });
  });
});
