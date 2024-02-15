import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  Firestore,
  collection,
  where,
  query,
  doc,
  collectionData,
  docData,
  DocumentReference,
  Query,
  DocumentData,
  addDoc,
  deleteDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, Subject, exhaustMap, from } from 'rxjs';
import { FirebaseCollection } from '../../shared/enums/firebase-collection.enum';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Vocabulary,
  VocabularyAddPayload,
} from '../../shared/models/vocabulary.model';
import { Lesson } from '../../shared/models/lesson.model';

export interface LessonState {
  vocabulary: Vocabulary[];
  lesson: Lesson | null;
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  // Dependencies
  firestore = inject(Firestore);
  route = inject(ActivatedRoute);
  lessonRef!: DocumentReference;
  vocabularyQuery!: Query;
  vocabularyCollection = collection(
    this.firestore,
    FirebaseCollection.VOCABULARY
  );
  destoyRef = inject(DestroyRef);

  // State
  private state = signal<LessonState>({
    vocabulary: [],
    lesson: null,
    loaded: false,
    error: null,
  });

  // Selectors
  vocabulary = computed(() => this.state().vocabulary);
  lesson = computed(() => this.state().lesson);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // Sources
  add$ = new Subject<VocabularyAddPayload>();
  edit$ = new Subject<Vocabulary>();
  remove$ = new Subject<string>();

  // Reducers are usually in constructor, but this time it should be called manually because of route data
  initializeState(lessonId: string) {
    this.lessonRef = doc(
      collection(this.firestore, FirebaseCollection.LESSONS),
      lessonId
    );
    this.vocabularyQuery = query(
      collection(this.firestore, FirebaseCollection.VOCABULARY),
      where('lesson', '==', this.lessonRef)
    );

    // Reducers
    this.readLesson()
      .pipe(
        exhaustMap((lesson) => {
          this.state.update((state) => ({
            ...state,
            lesson,
          }));
          return this.readVocabulary();
        }),
        takeUntilDestroyed(this.destoyRef)
      )
      .subscribe({
        next: (vocabulary) => {
          this.state.update((state) => ({
            ...state,
            vocabulary,
            loaded: true,
          }));
        },
        error: (err) =>
          this.state.update((state) => ({ ...state, error: err })),
      });

    this.add$
      .pipe(
        exhaustMap((payload) => this.addVocabulary(payload)),
        takeUntilDestroyed(this.destoyRef)
      )
      .subscribe();

    this.edit$
      .pipe(
        exhaustMap((payload) => this.updateVocabulary(payload)),
        takeUntilDestroyed(this.destoyRef)
      )
      .subscribe();

    this.remove$
      .pipe(
        exhaustMap((payload) => this.removeVocabulary(payload)),
        takeUntilDestroyed(this.destoyRef)
      )
      .subscribe();
  }

  readLesson() {
    return docData(this.lessonRef, {
      idField: 'id',
    }) as Observable<Lesson>;
  }

  readVocabulary(): Observable<Vocabulary[]> {
    return collectionData(this.vocabularyQuery, {
      idField: 'id',
    }) as Observable<Vocabulary[]>;
  }

  addVocabulary(
    payload: VocabularyAddPayload
  ): Observable<DocumentReference<DocumentData, DocumentData>> {
    const vocabulary = { ...payload, lesson: this.lessonRef };

    const promise = addDoc(this.vocabularyCollection, vocabulary);
    return from(promise);
  }

  removeVocabulary(id: string): Observable<void> {
    const docRef = doc(this.vocabularyCollection, `${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  updateVocabulary(payload: Vocabulary): Observable<void> {
    const docRef = doc(this.vocabularyCollection, `${payload.id}`);
    const promise = setDoc(docRef, payload);
    return from(promise);
  }
}
