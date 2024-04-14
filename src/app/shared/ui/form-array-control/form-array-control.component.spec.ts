import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FormArrayControlComponent } from './form-array-control.component';
import { FormArray, FormControl } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('Form array with controls Component', () => {
  let component: FormArrayControlComponent;
  let fixture: ComponentFixture<FormArrayControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormArrayControlComponent, TranslateModule.forRoot()],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(FormArrayControlComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FormArrayControlComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('arrayLabel', 'test');
    fixture.componentRef.setInput('controlLabel', 'test');
    fixture.componentRef.setInput('formArray', new FormArray([]));
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('input: arrayLabel', () => {
    it('should render label', () => {
      const labelElement = fixture.debugElement.query(
        By.css('[data-testid="array-label"]')
      );
      expect(labelElement).toBeTruthy();
    });
  });

  describe('input: controlLabel', () => {
    it('should render label', () => {
      fixture.componentRef.setInput(
        'formArray',
        new FormArray([new FormControl('')])
      );
      fixture.detectChanges();

      const labelElement = fixture.debugElement.query(
        By.css('[data-testid="control-label"]')
      );

      expect(labelElement).toBeTruthy();
    });
  });

  describe('input: formArray', () => {
    it('should render form control', () => {
      fixture.componentRef.setInput(
        'formArray',
        new FormArray([new FormControl('')])
      );
      fixture.detectChanges();

      const controlElement = fixture.debugElement.query(
        By.css('[data-testid="array-control"]')
      );

      expect(controlElement).toBeTruthy();
    });
  });

  describe('output: addItem', () => {
    it('should emit add item event', () => {
      fixture.componentRef.setInput(
        'formArray',
        new FormArray([new FormControl('')])
      );
      fixture.detectChanges();

      jest.spyOn(component.addItem, 'emit');

      const addButton = fixture.debugElement.query(
        By.css('[data-testid="add-item-button"]')
      );
      addButton.nativeElement.click();

      expect(component.addItem.emit).toHaveBeenCalled();
    });
  });

  describe('output: deleteItem', () => {
    it('should emit index to delete item from array', () => {
      fixture.componentRef.setInput(
        'formArray',
        new FormArray([new FormControl('')])
      );
      fixture.detectChanges();

      jest.spyOn(component.deleteItem, 'emit');

      const addButton = fixture.debugElement.query(
        By.css('[data-testid="delete-item-button"]')
      );
      addButton.nativeElement.click();

      expect(component.deleteItem.emit).toHaveBeenCalledWith(0);
    });
  });
});
