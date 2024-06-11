import { Injectable, computed, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  concatMap,
  exhaustMap,
  from,
  map,
  switchMap,
  tap,
} from 'rxjs';
import {
  collection,
  collectionData,
  doc,
  addDoc,
  deleteDoc,
  DocumentReference,
  DocumentData,
  Firestore,
  query,
  where,
  QueryConstraint,
  getCountFromServer,
  orderBy,
  limit,
  startAfter,
  limitToLast,
  endBefore,
} from '@angular/fire/firestore';
import { FirebaseCollection } from '../../shared/enums/firebase-collection.enum';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../../shared/data-access/auth.service';
import { ErrorHandlerService } from '../../shared/utils/error-handler.service';
import {
  VocabularyAddPayload,
  VocabularyListItem,
} from '../../shared/models/vocabulary.model';
import { VocabularyType } from '../../vocabulary-details/data-acess/dictionary.service';
import { FirebaseError } from '@angular/fire/app';

export interface VocabularyListState {
  vocabulary: VocabularyListItem[];
  totalSize: number | null;
  rowsPerPage: number;
  lastVisible: string | null;
  firstVisible: string | null;
  currentFilters: Partial<VocabularyListFilters>;
  loaded: boolean;
  error: string | null;
}

export interface VocabularyListFilters {
  title: string | null;
  type: VocabularyType | null;
  lessonDate: string | null;
  important: boolean | null;
  paginationDirection: 'next' | 'prev';
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
    totalSize: null,
    rowsPerPage: 10,
    lastVisible: null,
    firstVisible: null,
    currentFilters: {},
    loaded: false,
    error: null,
  });

  // Selectors
  vocabulary = computed(() => this.state().vocabulary);
  totalSize = computed(() => this.state().totalSize);
  rowsPerPage = computed(() => this.state().rowsPerPage);
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
            tap((res) => {
              this.state.update((state) => ({
                ...state,
                ...res,
                lastVisible: res.vocabulary[res.vocabulary.length - 1]?.title,
                firstVisible: res.vocabulary[0]?.title,
                loaded: true,
              }));
            }),
            catchError((err: FirebaseError) => {
              if (err.code === 'permission-denied') {
                return EMPTY;
              }
              return this.errorHandler.handleError(err.message);
            })
          );
        })
      ),
      this.add$.pipe(
        exhaustMap((payload) =>
          this.addVocabulary(payload).pipe(
            tap(() => this.filter$.next({})),
            catchError((err: FirebaseError) =>
              this.errorHandler.handleError(err.message)
            )
          )
        )
      ),
      this.remove$.pipe(
        exhaustMap((payload) =>
          this.removeVocabulary(payload).pipe(
            tap(() => this.filter$.next({})),
            catchError((err: FirebaseError) =>
              this.errorHandler.handleError(err.message)
            )
          )
        )
      ),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  readVocabularyList(
    filters: Partial<VocabularyListFilters>
  ): Observable<{ vocabulary: VocabularyListItem[]; totalSize: number }> {
    this.state.update((state) => ({
      ...state,
      currentFilters: {
        ...state.currentFilters,
        paginationDirection: undefined,
        ...filters,
      },
    }));

    let queryFilters: QueryConstraint[] = Object.entries(
      this.state().currentFilters
    )
      .filter(([key, value]) => value && key !== 'paginationDirection')
      .map(([key, value]) => {
        switch (key as VocabularyListFiltersKey) {
          case 'title': {
            return where('title', '==', value);
          }
          default: {
            return where(key, '==', value);
          }
        }
      });

    const collecionCount = from(
      getCountFromServer(
        query(this.vocabularyCollecion, orderBy('title'), ...queryFilters)
      )
    );

    if (filters.paginationDirection === 'next') {
      queryFilters = [
        ...queryFilters,
        startAfter(this.state().lastVisible),
        limit(this.state().rowsPerPage),
      ];
    }

    if (filters.paginationDirection === 'prev') {
      queryFilters = [
        ...queryFilters,
        endBefore(this.state().firstVisible),
        limitToLast(this.rowsPerPage()),
      ];
    }

    if (!filters.paginationDirection) {
      queryFilters = [...queryFilters, limit(this.state().rowsPerPage)];
    }

    return collecionCount.pipe(
      concatMap((res) => {
        return (
          collectionData(
            query(this.vocabularyCollecion, orderBy('title'), ...queryFilters),
            {
              idField: 'id',
            }
          ) as Observable<VocabularyListItem[]>
        ).pipe(
          map((vocabulary) => {
            return { vocabulary, totalSize: res.data().count };
          })
        );
      })
    );
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
