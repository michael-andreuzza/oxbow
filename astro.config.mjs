import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import alpinejs from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// Use node adapter for development, netlify for production
const localhost = process.env.NODE_ENV === "development";

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
  adapter: localhost ? node({ mode: "standalone" }) : netlify(),
  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
});
