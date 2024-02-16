import { Timestamp } from '@angular/fire/firestore';
export interface Lesson {
  id: string;
  title: string;
  date: Timestamp;
  studentCount: number;
  authorUid: string;
}

export type LessonAddPayload = Pick<Lesson, 'title' | 'date' | 'studentCount'>;
export type LessonEditPayload = Pick<Lesson, 'title' | 'date' | 'studentCount'>;
