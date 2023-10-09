import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      sourcemap: true,  // for Sentry
    },
    plugins: [
      react(),
      // Sentry vite plugin goes after all other plugins
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "ceph",
        project: "pulpito-ng",
        url: "https://sentry.ceph.com/",
      }),
    ],
    server: {
      port: 8081,
    },
    preview: {
      port: 8081,
    }
  };
});
