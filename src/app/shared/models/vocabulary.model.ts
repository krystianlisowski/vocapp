import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormArray, FormGroup } from '@angular/forms';
import { TypeOfSpeech } from '../enums/type-of-speech.enum';
import { VocabularyType } from '../../vocabulary-details/data-acess/dictionary.service';

export interface Vocabulary {
  id: string;
  authorUid: string;
  title: string;
  definitions: string[];
  lessonDate: Timestamp;
  translation: string;
  type: VocabularyType;
  important: boolean;
  examples?: string[];
  links?: VocabularyLink[];
}

export type VocabularyListItem = Pick<
  Vocabulary,
  'id' | 'title' | 'type' | 'lessonDate' | 'authorUid' | 'important'
>;
export interface VocabularyLink {
  title: string;
  link: string;
}

export type VocabularyAddPayload = Omit<Vocabulary, 'id'>;
export type VocabularyEditPayload = Omit<Vocabulary, 'id'>;
export type VocabularyArray = keyof Pick<
  Vocabulary,
  'examples' | 'links' | 'definitions'
>;
export type LinkForm = {
  title: FormControl<string>;
  link: FormControl<string>;
};
export type VocabularyForm = {
  title: FormControl<string>;
  type: FormControl<VocabularyType>;
  translation: FormControl<string>;
  lessonDate: FormControl<string>;
  important: FormControl<boolean>;
  definitions: FormArray<FormControl<string>>;
  examples: FormArray<FormControl<string>>;
  links: FormArray<FormGroup<LinkForm>>;
};

export const vocabularyTypeOptions: { label: string; value: VocabularyType }[] =
  [
    { label: 'vocabulary.type.noun', value: 'noun' },
    { label: 'vocabulary.type.verb', value: 'verb' },
    { label: 'vocabulary.type.adjective', value: 'adjective' },
    { label: 'vocabulary.type.adverb', value: 'adverb' },
    { label: 'vocabulary.type.idiom', value: 'idiom' },
  ];
