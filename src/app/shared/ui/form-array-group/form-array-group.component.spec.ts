import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormArrayGroupComponent } from './form-array-group.component';

describe('Form array with groups Component', () => {
  let component: FormArrayGroupComponent<any>;
  let fixture: ComponentFixture<FormArrayGroupComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormArrayGroupComponent, TranslateModule.forRoot()],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(FormArrayGroupComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FormArrayGroupComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('arrayLabel', 'test');
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

  describe('input: formArray', () => {
    it('should render form group', () => {
      fixture.componentRef.setInput(
        'formArray',
        new FormArray([new FormGroup({ test: new FormControl('') })])
      );
      fixture.detectChanges();

      const groupElement = fixture.debugElement.query(
        By.css('[data-testid="form-group"]')
      );

      expect(groupElement).toBeTruthy();
    });

    it('should render form group control', () => {
      fixture.componentRef.setInput(
        'formArray',
        new FormArray([new FormGroup({ test: new FormControl('') })])
      );
      fixture.detectChanges();

      const controlElement = fixture.debugElement.query(
        By.css('[data-testid="form-group-control"]')
      );

      expect(controlElement).toBeTruthy();
    });
  });

  describe('output: addItem', () => {
    it('should emit add item event', () => {
      fixture.componentRef.setInput(
        'formArray',
        new FormArray([new FormGroup({ test: new FormControl('') })])
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
        new FormArray([new FormGroup({ test: new FormControl('') })])
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
