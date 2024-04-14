import { importProvidersFrom, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FIREBASE_TEST_PROVIDERS } from '../../../app.config';
import { DatatableComponent } from './datatable.component';
import { DatatableManager } from './datatable';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('Lesson Component', () => {
  let component: DatatableComponent<any>;
  let fixture: ComponentFixture<DatatableComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatatableComponent, TranslateModule.forRoot()],
      providers: [importProvidersFrom(...FIREBASE_TEST_PROVIDERS)],
    })
      .overrideComponent(DatatableComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DatatableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput(
      'datatable',
      new DatatableManager({ rows: signal([]), visibleCols: [] })
    );
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('input: datatable', () => {
    it('should render table', () => {
      fixture.componentRef.setInput(
        'datatable',
        new DatatableManager({ rows: signal([]), visibleCols: [] })
      );

      fixture.detectChanges();

      const tableElement = fixture.debugElement.query(
        By.css('[data-testid="table-element"]')
      );

      expect(tableElement).toBeTruthy();
    });

    it('should not render any row if there is empty rows provided', () => {
      fixture.componentRef.setInput(
        'datatable',
        new DatatableManager({
          rows: signal([]),
          visibleCols: [],
        })
      );

      fixture.detectChanges();

      const tableElement = fixture.debugElement.query(
        By.css('[data-testid="table-row"]')
      );

      expect(tableElement).toBeFalsy();
    });

    it('should not render any row if there is empty rows provided', () => {
      fixture.componentRef.setInput(
        'datatable',
        new DatatableManager({
          rows: signal([{ id: 1, name: 'test' }]),
          visibleCols: [],
        })
      );

      fixture.detectChanges();

      const tableElement = fixture.debugElement.query(
        By.css('[data-testid="table-row"]')
      );

      expect(tableElement).toBeTruthy();
    });

    it('should not render any header col if there is empty visibleCols provided', () => {
      fixture.componentRef.setInput(
        'datatable',
        new DatatableManager({
          rows: signal([]),
          visibleCols: [],
        })
      );

      fixture.detectChanges();

      const tableElement = fixture.debugElement.query(
        By.css('[data-testid="table-header-col"]')
      );

      expect(tableElement).toBeFalsy();
    });

    it('should render header col if there is not empty visibleCols provided', () => {
      fixture.componentRef.setInput(
        'datatable',
        new DatatableManager({
          rows: signal([]),
          visibleCols: [
            {
              key: 'title',
              header: 'header',
            },
          ],
        })
      );

      fixture.detectChanges();

      const tableElement = fixture.debugElement.query(
        By.css('[data-testid="table-header-col"]')
      );

      expect(tableElement).toBeTruthy();
    });
  });
});
