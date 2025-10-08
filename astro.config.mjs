import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import alpinejs from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  devOptions: {
    devToolbar: false,
  },
  redirects: {
    "/tools/home": "/tools",
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables",
    },
  },
  build: {
    inlineStylesheets: "always",
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: "https://oxbowui.com",
  integrations: [
    sitemap(),
    mdx(),
    alpinejs({ entrypoint: "src/alpine" }),
    react(),
  ],
  adapter: netlify(),
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: [
        "node:fs",
        "node:fs/promises",
        "node:path",
        "node:url",
        "node:crypto",
      ],
    },
  },
});
