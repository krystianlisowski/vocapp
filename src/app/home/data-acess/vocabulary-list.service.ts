import { Injectable, computed, inject, signal } from '@angular/core';
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
import {
  VocabularyAddPayload,
  VocabularyListItem,
} from '../../shared/models/vocabulary.model';

export interface VocabularyListState {
  vocabulary: VocabularyListItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class VocabularyListService {
  // Dependencies
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);

  private vocabularyCollecion = collection(
    this.firestore,
    FirebaseCollection.VOCABULARY
  );

  // State
  private state = signal<VocabularyListState>({
    vocabulary: [],
    loaded: false,
    error: null,
  });

  // Selectors
  vocabulary = computed(() => this.state().vocabulary);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // Sources
  add$ = new Subject<VocabularyAddPayload>();
  remove$ = new Subject<string>();

  constructor() {
    // Reducers
    this.readVocabularyList()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (vocabulary) =>
          this.state.update((state) => ({
            ...state,
            vocabulary,
            loaded: true,
          })),
        error: (err) =>
          this.state.update((state) => ({ ...state, error: err })),
      });

    combineLatest([
      this.add$.pipe(
        exhaustMap((payload) =>
          this.addVocabulary(payload).pipe(
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
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  readVocabularyList(): Observable<VocabularyListItem[]> {
    return collectionData(this.vocabularyCollecion, {
      idField: 'id',
    }) as Observable<VocabularyListItem[]>;
  }

  addVocabulary(
    payload: VocabularyAddPayload
  ): Observable<DocumentReference<DocumentData, DocumentData>> {
    const promise = addDoc(this.vocabularyCollecion, {
      ...payload,
      authorUid: this.authService.user().uid,
    });
    return from(promise);
  }

  removeVocabulary(id: string): Observable<void> {
    const docRef = doc(this.vocabularyCollecion, `${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}
