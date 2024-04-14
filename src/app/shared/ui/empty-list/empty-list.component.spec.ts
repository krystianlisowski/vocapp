import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EmptyListComponent } from './empty-list.component';
import { TranslateModule } from '@ngx-translate/core';

describe('Empty list component', () => {
  let component: EmptyListComponent;
  let fixture: ComponentFixture<EmptyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmptyListComponent, TranslateModule.forRoot()],
      providers: [],
    })
      .overrideComponent(EmptyListComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EmptyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty list element', () => {
    const actionsElement = fixture.debugElement.query(
      By.css('[data-testid="empty-list-element"]')
    );
    expect(actionsElement).toBeTruthy();
  });
});
