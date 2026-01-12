import sitemap from "@astrojs/sitemap";
import alpinejs from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

console.log("Loading app with NODE_ENV: ", process.env.NODE_ENV);
// https://astro.build/config
export default defineConfig({
  devOptions: {
    devToolbar: false,
  },
  redirects: {
    "/tools/home": "/tools",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "poimandres",
      },
    },
  },
  build: {
    inlineStylesheets: "always",
  },
  site: "https://oxbowui.com",
  integrations: [
    sitemap(),
    alpinejs({ entrypoint: "src/alpine" }),
    react(),
  ],
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
