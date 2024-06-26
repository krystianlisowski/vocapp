import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DebugElement, importProvidersFrom } from '@angular/core';
import { HomeComponent } from './home.component';
import { FIREBASE_TEST_PROVIDERS } from '../app.config';
import { AuthService } from '../shared/data-access/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Timestamp } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { DeleteConfirmDialogComponent } from '../shared/ui/delete-confirm-dialog/delete-confirm-dialog.component';
import { of } from 'rxjs';
import { VocabularyListService } from './data-acess/vocabulary-list.service';
import { VocabularyListItem } from '../shared/models/vocabulary.model';
import { AddVocabularyDialogComponent } from '../vocabulary-details/ui/add-vocabulary-dialog/add-vocabulary-dialog.component';
import { PageEvent } from '@angular/material/paginator';

describe('Home Component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;

  let vocabularyService: VocabularyListService;
  let dialog: MatDialog;

  const listMock: VocabularyListItem[] = [
    {
      id: 'test',
      title: 'test',
      lessonDate: new Timestamp(1, 1),
      type: 'verb',
      important: false,
      authorUid: 'test',
    },
  ];

  const authServiceMock = {
    user: jest.fn(),
  };

  const vocabularyServiceMock = {
    vocabulary: jest.fn().mockReturnValue(listMock),
    totalSize: jest.fn().mockReturnValue(100),
    rowsPerPage: jest.fn().mockReturnValue(10),
    filter$: {
      next: jest.fn(),
    },
    remove$: {
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
          provide: VocabularyListService,
          useValue: vocabularyServiceMock,
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
    vocabularyService = TestBed.inject(VocabularyListService);
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

  describe('add vocabulary', () => {
    const dialogRefMock = {
      afterClosed: jest.fn(() =>
        of({
          title: 'string',
          definitions: ['string'],
          translation: 'string',
          type: 'verb',
          lessonDate: new Timestamp(1, 1),
          important: false,
          examples: [],
          links: [],
        })
      ),
    } as any;

    // we want tests to be passed only if user is logged in
    beforeAll(() => {
      authServiceMock.user.mockReturnValue({ emailVerified: true });
    });

    beforeEach(() => {
      jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock);
      jest.spyOn(component, 'openAddDialog');
    });

    it('should render add vocabulary button', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement).toBeTruthy();
    });

    it('should open add dialog after button clicked', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      expect(component.openAddDialog).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(AddVocabularyDialogComponent);
    });

    it('it should call add method if dialog was closed with lesson object', () => {
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(vocabularyService.add$.next).toHaveBeenCalled();
    });
  });

  describe('app-vocabulary-list', () => {
    let vocabularyListComponent: DebugElement;

    beforeEach(() => {
      vocabularyListComponent = fixture.debugElement.query(
        By.css('app-vocabulary-list')
      );
    });

    describe('input: vocabulary', () => {
      it('should use vocabulary array as an input', () => {
        expect(vocabularyListComponent.componentInstance.vocabulary()).toEqual(
          listMock
        );
      });
    });

    describe('output: vocabularyDeleted', () => {
      const dialogRefMock = {
        afterClosed: jest.fn(() => of('true')),
      } as any;

      beforeEach(() => {
        jest.spyOn(dialog, 'open').mockReturnValue(dialogRefMock);
        jest.spyOn(component, 'openDeleteDialog');
        vocabularyListComponent.triggerEventHandler('vocabularyDeleted', '0');
        fixture.detectChanges();
      });

      it('should open delete confirm dialog', () => {
        expect(component.openDeleteDialog).toHaveBeenCalledWith('0');
        expect(dialog.open).toHaveBeenCalledWith(DeleteConfirmDialogComponent);
      });

      it('it should call remove method if dialog was closed with truthy value', () => {
        expect(dialogRefMock.afterClosed).toHaveBeenCalled();
        expect(vocabularyService.remove$.next).toHaveBeenCalled();
      });
    });
  });

  describe('app-vocabulary-list-filters', () => {
    let vocabularyListFiltersComponent: DebugElement;
    const filtersMock = {
      title: 'test',
    };

    beforeEach(() => {
      vocabularyListFiltersComponent = fixture.debugElement.query(
        By.css('app-vocabulary-list-filters')
      );
    });

    describe('output: filtersChanged ', () => {
      beforeEach(() => {
        jest.spyOn(component.vocabularyService.filter$, 'next');
        vocabularyListFiltersComponent.triggerEventHandler(
          'filtersChanged',
          filtersMock
        );
        fixture.detectChanges();
      });

      it('it should call filter subject from service', () => {
        expect(vocabularyService.filter$.next).toHaveBeenCalledWith(
          filtersMock
        );
      });
    });
  });

  describe('app-pagination', () => {
    let paginationComponent: DebugElement;
    const eventMock: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      previousPageIndex: 0,
      length: 100,
    };

    beforeEach(() => {
      paginationComponent = fixture.debugElement.query(
        By.css('app-pagination')
      );
    });

    describe('input: totalSize', () => {
      it('should use totalSize from service as an input', () => {
        expect(paginationComponent.componentInstance.totalSize()).toEqual(
          vocabularyServiceMock.totalSize()
        );
      });

      it('should use rowsPerPage from service as an input', () => {
        expect(paginationComponent.componentInstance.rowsPerPage()).toEqual(
          vocabularyServiceMock.rowsPerPage()
        );
      });
    });

    describe('output: pageChanged', () => {
      beforeEach(() => {
        jest.spyOn(component, 'onPageChanged');
        jest.spyOn(vocabularyServiceMock.filter$, 'next');
        paginationComponent.triggerEventHandler('pageChanged', eventMock);
        fixture.detectChanges();
      });

      it('should call filter subject with next page param', () => {
        expect(vocabularyServiceMock.filter$.next).toHaveBeenCalledWith({
          paginationDirection: 'next',
        });
      });
    });
  });
});
