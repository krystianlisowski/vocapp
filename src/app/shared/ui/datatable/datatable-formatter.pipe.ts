import { Pipe, type PipeTransform } from '@angular/core';
import { DatatableCol } from './datatable';

@Pipe({
  name: 'datatableFormatter',
  standalone: true,
})
export class DatatableFormatterPipe implements PipeTransform {
  transform<T>(row: T, col: DatatableCol<T>): string {
    return col.formatter
      ? col.formatter(row)
      : (row[col.key as keyof T] as string);
  }
}
