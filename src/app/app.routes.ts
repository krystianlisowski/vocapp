import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./lesson/lesson.component').then((c) => c.LessonComponent),
  },
];
