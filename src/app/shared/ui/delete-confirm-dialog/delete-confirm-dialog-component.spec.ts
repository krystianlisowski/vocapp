import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';

describe('Delete confirm dialog Component', () => {
  let component: DeleteConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmDialogComponent>;
  let dialogRef: MatDialogRef<DeleteConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteConfirmDialogComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
      ],
    })
      .overrideComponent(DeleteConfirmDialogComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmDialogComponent);
    dialogRef = TestBed.inject(MatDialogRef<DeleteConfirmDialogComponent>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('dialog title', () => {
    it('should render a title', () => {
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('should close modal after button click', () => {
      jest.spyOn(dialogRef, 'close');
      const closeButton = fixture.debugElement.query(
        By.css('[data-testid="close-button"]')
      );
      closeButton.nativeElement.click();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close modal with truthy value after save button click', () => {
      jest.spyOn(dialogRef, 'close');

      const submitButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );
      submitButton.nativeElement.click();

      expect(dialogRef.close).toHaveBeenCalledWith('true');
    });
  });
});
