import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PaginationComponent } from './pagination.component';
import { DebugElement, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

describe('Pagination Component', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent, TranslateModule.forRoot()],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(PaginationComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('totalSize', 0);
    fixture.componentRef.setInput('rowsPerPage', 10);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('input: totalSize', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('totalSize', 100);
      fixture.detectChanges();
    });

    it('should render pagination element', () => {
      const paginationElement = fixture.debugElement.query(
        By.css('[data-testid="pagination"]')
      );
      expect(paginationElement).toBeTruthy();
    });
  });

  describe('output: pageChanged', () => {
    let matPaginationElement: DebugElement;

    beforeEach(() => {
      fixture.componentRef.setInput('totalSize', 100);
      fixture.detectChanges();

      matPaginationElement = fixture.debugElement.query(
        By.css('[data-testid="pagination"]')
      );
    });

    it('should emit pageChanged event', () => {
      const eventMock: PageEvent = {
        pageIndex: 1,
        pageSize: 10,
        previousPageIndex: 0,
        length: 100,
      };
      jest.spyOn(component.pageChanged, 'emit');
      matPaginationElement.triggerEventHandler('page', eventMock);

      expect(component.pageChanged.emit).toHaveBeenCalledWith(eventMock);
    });
  });
});
