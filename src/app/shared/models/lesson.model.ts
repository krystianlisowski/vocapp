export interface Lesson {
  id: string;
  title: string;
  date: Date;
  studentCount: number;
}

export type LessonAddPayload = Pick<Lesson, 'title' | 'date' | 'studentCount'>;
export type LessonEditPayload = Pick<Lesson, 'title' | 'date' | 'studentCount'>;
