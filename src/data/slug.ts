/** "Where I've worked" → "where-ive-worked" — apostrophes drop, not hyphenate. */
export function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
