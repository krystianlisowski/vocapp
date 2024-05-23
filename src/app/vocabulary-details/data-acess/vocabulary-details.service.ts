import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  deleteDoc,
  setDoc,
  Firestore,
} from '@angular/fire/firestore';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  from,
} from 'rxjs';
import { FirebaseCollection } from '../../shared/enums/firebase-collection.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Vocabulary } from '../../shared/models/vocabulary.model';
import { ErrorHandlerService } from '../../shared/utils/error-handler.service';

export interface VocabularyDetailsState {
  vocabulary: Vocabulary | null;
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class VocabularyDetailsService {
  // Dependencies
  private firestore = inject(Firestore);
  private errorHandler = inject(ErrorHandlerService);

  private vocabularyRef!: DocumentReference;
  private vocabularyCollection = collection(
    this.firestore,
    FirebaseCollection.VOCABULARY
  );
  private destoyRef = inject(DestroyRef);

  // State
  private state = signal<VocabularyDetailsState>({
    vocabulary: null,
    loaded: false,
    error: null,
  });

  // Selectors
  vocabulary = computed(() => this.state().vocabulary);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // Sources
  edit$ = new Subject<Vocabulary>();
  remove$ = new Subject<string>();

  // Reducers are usually in constructor, but this time it should be called manually because of route data
  initializeState(vocabularyId: string) {
    this.vocabularyRef = doc(
      collection(this.firestore, FirebaseCollection.VOCABULARY),
      vocabularyId
    );

    // Reducers
    this.readDetails()
      .pipe(takeUntilDestroyed(this.destoyRef))
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

    combineLatest([
      this.edit$.pipe(
        exhaustMap((payload) =>
          this.updateVocabulary(payload).pipe(
            catchError((err) => this.errorHandler.handleError(err))
          )
        )
      ),
      this.remove$.pipe(
        exhaustMap((payload) =>
          this.removeVocabulary(payload).pipe(
            catchError((err) => this.errorHandler.handleError(err))
          )
        )
      ),
    ])
      .pipe(takeUntilDestroyed(this.destoyRef))
      .subscribe();
  }

  readDetails() {
    return docData(this.vocabularyRef, {
      idField: 'id',
    }) as Observable<Vocabulary>;
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
