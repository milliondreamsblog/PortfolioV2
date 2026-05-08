// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://milliondreams.vercel.app",
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  // 301 redirects — the previous owner's stale Webflow URLs were removed.
  // Add new entries here only when there's an old URL of mine that Google
  // still has indexed and needs to be consolidated to a new path.
  redirects: {
    "/play": { status: 301, destination: "/playground" },
  },
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
    server: {
      // Miniflare (platformProxy) churns SQLite WAL/SHM files under
      // .wrangler/state on every D1 read. Without this, each /onboarding
      // SSR hits D1 → WAL writes → Vite HMR full-reload → next SSR, in an
      // ~10s loop that re-rolls the visitor name on its own.
      watch: {
        ignored: [
          (/** @type {string} */ p) => p.includes(".wrangler"),
          "**/dist/**",
        ],
      },
    },
  },
});
