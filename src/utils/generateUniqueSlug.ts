import { slugify } from 'transliteration';

export const generateUniqueSlug = (val: string) =>
  slugify(val)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
