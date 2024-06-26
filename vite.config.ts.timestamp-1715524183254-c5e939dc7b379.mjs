// vite.config.ts
import { vitePlugin as remix } from "file:///Users/sostenes/dev/pedegas/remix-shadcn/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/sostenes/dev/pedegas/remix-shadcn/node_modules/vite/dist/node/index.js";
import envOnly from "file:///Users/sostenes/dev/pedegas/remix-shadcn/node_modules/vite-env-only/dist/index.js";
import tsconfigPaths from "file:///Users/sostenes/dev/pedegas/remix-shadcn/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    envOnly(),
    tsconfigPaths(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc29zdGVuZXMvZGV2L3BlZGVnYXMvcmVtaXgtc2hhZGNuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc29zdGVuZXMvZGV2L3BlZGVnYXMvcmVtaXgtc2hhZGNuL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zb3N0ZW5lcy9kZXYvcGVkZWdhcy9yZW1peC1zaGFkY24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGVudk9ubHkgZnJvbSBcInZpdGUtZW52LW9ubHlcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtcblx0XHRlbnZPbmx5KCksXG5cdFx0dHNjb25maWdQYXRocygpLFxuXHRcdHJlbWl4KHtcblx0XHRcdGZ1dHVyZToge1xuXHRcdFx0XHR2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcblx0XHRcdFx0djNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXG5cdFx0XHRcdHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXG5cdFx0XHR9LFxuXHRcdH0pLFxuXHRdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBTLFNBQVMsY0FBYyxhQUFhO0FBQzlVLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sYUFBYTtBQUNwQixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsSUFDZCxNQUFNO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDUCxtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxNQUN0QjtBQUFBLElBQ0QsQ0FBQztBQUFBLEVBQ0Y7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
