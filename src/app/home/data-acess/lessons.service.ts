import { Injectable, computed, inject, signal } from '@angular/core';
import { Lesson, LessonAddPayload } from '../../shared/models/lesson.model';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  from,
} from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  DocumentReference,
  DocumentData,
} from '@angular/fire/firestore';
import { FirebaseCollection } from '../../shared/enums/firebase-collection.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../shared/data-access/auth.service';
import { handleError } from '../../shared/utils/handle-error';

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
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private lessonsCollecion = collection(
    this.firestore,
    FirebaseCollection.LESSONS
  );

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

    combineLatest([
      this.add$.pipe(
        exhaustMap((payload) =>
          this.addLesson(payload).pipe(catchError((err) => handleError(err)))
        )
      ),
      this.edit$.pipe(
        exhaustMap((payload) =>
          this.updateLesson(payload).pipe(catchError((err) => handleError(err)))
        )
      ),
      this.remove$.pipe(
        exhaustMap((payload) =>
          this.removeLesson(payload).pipe(catchError((err) => handleError(err)))
        )
      ),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  readLessons(): Observable<Lesson[]> {
    return collectionData(this.lessonsCollecion, {
      idField: 'id',
    }) as Observable<Lesson[]>;
  }

  addLesson(
    payload: LessonAddPayload
  ): Observable<DocumentReference<DocumentData, DocumentData>> {
    const promise = addDoc(this.lessonsCollecion, {
      ...payload,
      authorUid: this.authService.user().uid,
    });
    return from(promise);
  }

  removeLesson(id: string): Observable<void> {
    const docRef = doc(this.lessonsCollecion, `${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  updateLesson(payload: Lesson): Observable<void> {
    const docRef = doc(this.lessonsCollecion, `${payload.id}`);
    const promise = setDoc(docRef, payload);
    return from(promise);
  }
}
