// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Replace with the real domain before launch — it is what canonical/OG URLs
  // and the sitemap are built from.
  site: 'https://example.dev',
  build: {
    // One page, one stylesheet. Avoids a render-blocking <link> for ~8kB of CSS.
    inlineStylesheets: 'always',
  },
});
