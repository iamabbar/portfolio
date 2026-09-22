// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Canonical/OG URLs and the sitemap are built from this. Update it if the
  // site moves to a custom domain.
  site: 'https://mohamadabbar.vercel.app',
  build: {
    // One page, one stylesheet. Avoids a render-blocking <link> for ~8kB of CSS.
    inlineStylesheets: 'always',
  },
});
