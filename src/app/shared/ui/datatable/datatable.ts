import { TemplateRef, Signal, signal } from '@angular/core';

export interface DatatableCol<T> {
  key: string;
  header: string;
  template?: TemplateRef<any>;
  formatter?: (item: T) => string;
}

export interface DatatableConfig<T> {
  rows: Signal<T[]>;
  visibleCols: DatatableCol<T>[];
}

export class DatatableManager<T extends { [key: string]: any }> {
  rows: Signal<T[]> = signal([]);
  visibleCols: DatatableCol<T>[] = [];
  visibleColsKeys: string[] = [];

  constructor(config: DatatableConfig<T>) {
    this.rows = config.rows;
    this.visibleCols = config.visibleCols;
    this.visibleColsKeys = this.visibleCols.map((col) => col.key);
  }
}
