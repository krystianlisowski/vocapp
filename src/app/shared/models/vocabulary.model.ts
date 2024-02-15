export interface Vocabulary {
  id: string;
  title: string;
  definition: string;
  translation: string;
  examples: string[];
  links: VocabularyLink[];
}

interface VocabularyLink {
  title: string;
  link: string;
}

export type VocabularyAddPayload = Omit<Vocabulary, 'id'>;
export type VocabularyEditPayload = Omit<Vocabulary, 'id'>;
