import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
const DEPLOYMENT = process.env.DEPLOYMENT;
export default defineConfig(() => {
  let config = {
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
    preview: {
      port: 8081,
    }
  };
  if (DEPLOYMENT == "development") {
    config['server'] = {
      port: 8081,
      host: true,
      watch: {
        usePolling: true,
      },
    }
  } else {
    config['server'] = {
      port: 8081,
    }
  }
  return config;
});
