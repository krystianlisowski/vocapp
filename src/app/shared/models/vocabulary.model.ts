import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormArray, FormGroup } from '@angular/forms';
import { TypeOfSpeech } from '../enums/type-of-speech.enum';
import { VocabularyType } from '../../lesson/data-acess/dictionary.service';

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
