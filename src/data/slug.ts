/**
 * "Where I've worked" → "where-ive-worked".
 *
 * Anchor ids are derived from the label a visitor reads rather than written
 * by hand, so the URL always names the section it lands on. Apostrophes are
 * dropped rather than replaced — "I've" becomes "ive", not "i-ve".
 */
export function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
