import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Lesson } from '../../../shared/models/lesson.model';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (item of lessons; track $index) {
    <p>{{ item.title }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonListComponent {
  @Input({ required: true }) lessons: Lesson[] = [];
}
