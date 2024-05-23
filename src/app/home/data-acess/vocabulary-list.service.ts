import { Injectable, computed, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  from,
  switchMap,
  tap,
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
  query,
  where,
  QueryFieldFilterConstraint,
  QueryConstraint,
} from '@angular/fire/firestore';
import { FirebaseCollection } from '../../shared/enums/firebase-collection.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../shared/data-access/auth.service';
import { ErrorHandlerService } from '../../shared/utils/error-handler.service';
import {
  VocabularyAddPayload,
  VocabularyListItem,
} from '../../shared/models/vocabulary.model';
import { VocabularyType } from '../../lesson/data-acess/dictionary.service';

export interface VocabularyListState {
  vocabulary: VocabularyListItem[];
  loaded: boolean;
  error: string | null;
}

export interface VocabularyListFilters {
  title: string | null;
  type: VocabularyType | null;
  lessonDate: string | null;
  important: boolean | null;
}

export type VocabularyListFiltersKey = keyof VocabularyListFilters;

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
  filter$ = new BehaviorSubject<Partial<VocabularyListFilters>>({});
  add$ = new Subject<VocabularyAddPayload>();
  remove$ = new Subject<string>();

  constructor() {
    // Reducers
    combineLatest([
      this.filter$.pipe(
        switchMap((payload) => {
          return this.readVocabularyList(payload).pipe(
            tap((vocabulary) =>
              this.state.update((state) => ({
                ...state,
                vocabulary,
                loaded: true,
              }))
            ),
            catchError((err) => this.errorHandler.handleError(err))
          );
        })
      ),
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

  readVocabularyList(
    filters: Partial<VocabularyListFilters>
  ): Observable<VocabularyListItem[]> {
    const queryFilters: QueryConstraint[] = filters
      ? Object.entries(filters)
          .filter(([_, value]) => value)
          .map(([key, value]) => {
            switch (key as VocabularyListFiltersKey) {
              case 'title': {
                return where('title', '==', value); // TODO
              }
              default: {
                return where(key, '==', value);
              }
            }
          })
      : [];

    return collectionData(query(this.vocabularyCollecion, ...queryFilters), {
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
