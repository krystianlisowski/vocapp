import { Injectable, computed, inject, signal } from '@angular/core';
import { Lesson, LessonAddPayload } from '../../shared/models/lesson.model';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  from,
} from 'rxjs';
import {
  collection,
  collectionData,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  DocumentReference,
  DocumentData,
  Firestore,
} from '@angular/fire/firestore';
import { FirebaseCollection } from '../../shared/enums/firebase-collection.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../shared/data-access/auth.service';
import { ErrorHandlerService } from '../../shared/utils/error-handler.service';

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
  private errorHandler = inject(ErrorHandlerService);

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
          this.addLesson(payload).pipe(
            catchError((err) => this.errorHandler.handleError(err))
          )
        )
      ),
      this.edit$.pipe(
        exhaustMap((payload) =>
          this.updateLesson(payload).pipe(
            catchError((err) => this.errorHandler.handleError(err))
          )
        )
      ),
      this.remove$.pipe(
        exhaustMap((payload) =>
          this.removeLesson(payload).pipe(
            catchError((err) => this.errorHandler.handleError(err))
          )
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
