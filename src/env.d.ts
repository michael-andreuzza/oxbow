/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import type { Alpine } from "alpinejs";

interface ImportMetaEnv {
  // Add your environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    Alpine: Alpine;
  }

  namespace App {
    interface Locals {
      // add props here
    }
  }
}
