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
} from '@angular/fire/firestore';
import { Observable, Subject, exhaustMap } from 'rxjs';
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
  vocabularyCollection!: Query;
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
    this.vocabularyCollection = query(
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
  }

  readLesson() {
    return docData(this.lessonRef, {
      idField: 'id',
    }) as Observable<Lesson>;
  }

  readVocabulary(): Observable<Vocabulary[]> {
    return collectionData(this.vocabularyCollection, {
      idField: 'id',
    }) as Observable<Vocabulary[]>;
  }
}
