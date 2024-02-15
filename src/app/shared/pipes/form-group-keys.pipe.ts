import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'formGroupKeys',
  standalone: true,
})
export class FormGroupKeysPipe implements PipeTransform {
  transform<T extends { [K in keyof T]: AbstractControl<any, any> }>(
    group: FormGroup<T>
  ) {
    return Object.keys(group.controls);
  }
}
