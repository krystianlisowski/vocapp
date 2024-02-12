import { Injectable, computed, inject, signal } from '@angular/core';
import { Lesson, LessonAddPayload } from '../models/lesson.model';
import { Observable, Subject, exhaustMap, from } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { FirebaseCollection } from '../enums/firebase-collection.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface LessonsState {
  lessons: Lesson[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  // Dependencies
  firestore = inject(Firestore);
  lessonsCollecion = collection(this.firestore, FirebaseCollection.LESSONS);

  // State
  private state = signal<LessonsState>({
    lessons: [],
    loaded: false,
    error: null,
  });

  // Selectors
  lessons = computed(() => this.state().lessons);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // Sources
  add$ = new Subject<LessonAddPayload>();
  edit$ = new Subject<Lesson>();
  remove$ = new Subject<string>();

  constructor() {
    // Reducers
    this.readLessons()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (lessons) =>
          this.state.update((state) => ({
            ...state,
            lessons,
            loaded: true,
          })),
        error: (err) =>
          this.state.update((state) => ({ ...state, error: err })),
      });

    this.add$
      .pipe(
        exhaustMap((payload) => this.addLesson(payload)),
        takeUntilDestroyed()
      )
      .subscribe((lesson) =>
        this.state.update((state) => ({
          ...state,
          lessons: [...state.lessons, lesson],
        }))
      );

    this.edit$
      .pipe(
        exhaustMap((payload) => this.updateLesson(payload)),
        takeUntilDestroyed()
      )
      .subscribe((lesson) =>
        this.state.update((state) => ({
          ...state,
          lessons: state.lessons.map((l) =>
            l.id === lesson.id ? { ...lesson } : l
          ),
        }))
      );

    this.remove$
      .pipe(
        exhaustMap((payload) => this.removeLesson(payload)),
        takeUntilDestroyed()
      )
      .subscribe((lessonId) =>
        this.state.update((state) => ({
          ...state,
          lessons: state.lessons.filter((lesson) => lesson.id !== lessonId),
        }))
      );
  }

  readLessons(): Observable<Lesson[]> {
    return collectionData(this.lessonsCollecion, {
      idField: 'id',
    }) as Observable<Lesson[]>;
  }

  addLesson(payload: LessonAddPayload): Observable<any> {
    const promise = addDoc(this.lessonsCollecion, payload);
    return from(promise);
  }

  removeLesson(id: string): Observable<string> {
    const docRef = doc(this.lessonsCollecion, `${id}`);
    const promise = deleteDoc(docRef);
    return from(id);
  }

  updateLesson(payload: Lesson): Observable<any> {
    const docRef = doc(this.lessonsCollecion, `${payload.id}`);
    const promise = setDoc(docRef, payload);
    return from(promise);
  }
}
