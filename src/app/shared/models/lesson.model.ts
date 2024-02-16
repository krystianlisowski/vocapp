import { Timestamp } from '@angular/fire/firestore';
export interface Lesson {
  id: string;
  title: string;
  date: Timestamp;
  studentsCount: number;
  authorUid: string;
}

export type LessonAddPayload = Pick<Lesson, 'title' | 'date' | 'studentsCount'>;
export type LessonEditPayload = Pick<
  Lesson,
  'title' | 'date' | 'studentsCount'
>;
