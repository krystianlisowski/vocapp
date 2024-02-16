import { FormControl, FormArray, FormGroup } from '@angular/forms';

export interface Vocabulary {
  id: string;
  title: string;
  definition: string;
  translation: string;
  examples: string[];
  links: VocabularyLink[];
  authorUid: string;
}

export interface VocabularyLink {
  title: string;
  link: string;
}

export type VocabularyAddPayload = Omit<Vocabulary, 'id'>;
export type VocabularyEditPayload = Omit<Vocabulary, 'id'>;
export type VocabularyArray = keyof Pick<Vocabulary, 'examples' | 'links'>;
export type LinkForm = {
  title: FormControl<string>;
  link: FormControl<string>;
};
export type VocabularyForm = {
  title: FormControl<string>;
  translation: FormControl<string>;
  definition: FormControl<string>;
  examples: FormArray<FormControl<string>>;
  links: FormArray<FormGroup<LinkForm>>;
};
