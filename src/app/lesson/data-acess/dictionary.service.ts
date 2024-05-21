import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  map,
  single,
  switchMap,
  tap,
} from 'rxjs';

export interface LessonState {
  word: string | null;
  type: VocabularyType | null;
  definitions: DictionaryResponse[];
  error: string | null;
  loading: boolean;
  currentIndex: number;
  currentDefinitions: string[] | undefined;
}

export type VocabularyType = 'noun' | 'verb' | 'adjective';

interface DictionaryResponse {
  word: string;
  meanings: DictionaryMeaning[];
}

interface DictionaryMeaning {
  partOfSpeech: VocabularyType;
  definitions: { definition: string }[];
}

const DEFAULT_STATE = {
  word: null,
  type: null,
  definitions: [],
  error: null,
  loading: false,
  currentIndex: 0,
  currentDefinitions: undefined,
};

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  private readonly http = inject(HttpClient);
  private readonly dictionaryAPIUrl =
    'https://api.dictionaryapi.dev/api/v2/entries/en/';

  // State
  private state = signal<LessonState>(DEFAULT_STATE);

  // Selectors
  definitions = computed(() => this.state().currentDefinitions);
  currentIndex = computed(() => this.state().currentIndex);
  currentWord = computed(() => this.state().word);
  definitionsCount = computed(
    () =>
      this.state().definitions.filter((def) =>
        def.meanings.find(
          (meaning) => meaning.partOfSpeech === this.state().type
        )
      ).length
  );

  error = computed(() => this.state().error);

  // Sources
  private readonly search$ = new Subject<{
    word: string;
    type: VocabularyType;
  }>();
  searchAnother$ = new Subject<void>();

  constructor() {
    this.search$
      .pipe(
        switchMap((params) => {
          this.state.update((state) => ({
            ...state,
            loading: true,
            word: params.word,
            type: params.type,
            currentIndex: 0,
          }));
          return this.readWord(params.word).pipe(
            catchError((err) => {
              this.state.update((state) => ({ ...DEFAULT_STATE, error: err }));
              return EMPTY;
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (res) =>
          this.state.update((state) => ({
            ...state,
            loading: false,
            definitions: res.filter((def) =>
              def.meanings.find(
                (meaning) => meaning.partOfSpeech === this.state().type
              )
            ),
            currentDefinitions: this.createDefinitionsArray(
              res,
              state.type!,
              0
            ),
          })),
        error: (err) =>
          this.state.update((state) => ({ ...DEFAULT_STATE, error: err })),
      });

    this.searchAnother$
      .pipe(
        tap(() => {
          this.state.update((state) => ({
            ...state,
            currentIndex: state.definitions.filter((def) =>
              def.meanings.find(
                (meaning) => meaning.partOfSpeech === this.state().type
              )
            )[state.currentIndex + 1]
              ? state.currentIndex + 1
              : 0,
            currentDefinitions:
              this.createDefinitionsArray(
                state.definitions,
                state.type!,
                state.currentIndex + 1
              ) ??
              this.createDefinitionsArray(state.definitions, state.type!, 0),
          }));
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private readWord(word: string): Observable<DictionaryResponse[]> {
    return this.http.get<DictionaryResponse[]>(
      this.dictionaryAPIUrl + `${word}`
    );
  }

  private createDefinitionsArray(
    definitions: DictionaryResponse[],
    type: VocabularyType,
    index: number
  ): string[] | undefined {
    return definitions[index]?.meanings
      .filter((meaning) => meaning.partOfSpeech === type)
      .flat()
      ?.map((item) => item.definitions.map((def) => def.definition))
      .flat();
  }

  onDictionarySearch(currentWord: string, type: VocabularyType) {
    if (!currentWord) {
      return;
    }

    if (currentWord === this.state().word && this.state().type === type) {
      this.state.update((state) => ({
        ...state,
        type,
      }));

      this.searchAnother$.next();
      return;
    }

    this.search$.next({ word: currentWord, type });
  }
}
