import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4321",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // Setup node events here if needed
    },
  },
});
