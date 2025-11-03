// vite.config.ts
import tailwindcss from "file:///Users/moayyadfaris/projects/kuybi-project/kuybi-dashboard/node_modules/@tailwindcss/vite/dist/index.mjs";
import vue from "file:///Users/moayyadfaris/projects/kuybi-project/kuybi-dashboard/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///Users/moayyadfaris/projects/kuybi-project/kuybi-dashboard/node_modules/vite/dist/node/index.js";
import { vitePluginManusRuntime } from "file:///Users/moayyadfaris/projects/kuybi-project/kuybi-dashboard/node_modules/vite-plugin-manus-runtime/dist/index.js";
var __vite_injected_original_dirname = "/Users/moayyadfaris/projects/kuybi-project/kuybi-dashboard";
var plugins = [vue(), tailwindcss(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "client", "src"),
      "@shared": path.resolve(__vite_injected_original_dirname, "shared"),
      "@assets": path.resolve(__vite_injected_original_dirname, "attached_assets")
    }
  },
  envDir: path.resolve(__vite_injected_original_dirname),
  root: path.resolve(__vite_injected_original_dirname, "client"),
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    port: 3e3,
    strictPort: false,
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbW9heXlhZGZhcmlzL3Byb2plY3RzL2t1eWJpLXByb2plY3Qva3V5YmktZGFzaGJvYXJkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbW9heXlhZGZhcmlzL3Byb2plY3RzL2t1eWJpLXByb2plY3Qva3V5YmktZGFzaGJvYXJkL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tb2F5eWFkZmFyaXMvcHJvamVjdHMva3V5YmktcHJvamVjdC9rdXliaS1kYXNoYm9hcmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCBmcyBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyB2aXRlUGx1Z2luTWFudXNSdW50aW1lIH0gZnJvbSBcInZpdGUtcGx1Z2luLW1hbnVzLXJ1bnRpbWVcIjtcblxuY29uc3QgcGx1Z2lucyA9IFt2dWUoKSwgdGFpbHdpbmRjc3MoKSwgdml0ZVBsdWdpbk1hbnVzUnVudGltZSgpXTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2lucyxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsIFwiY2xpZW50XCIsIFwic3JjXCIpLFxuICAgICAgXCJAc2hhcmVkXCI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcInNoYXJlZFwiKSxcbiAgICAgIFwiQGFzc2V0c1wiOiBwYXRoLnJlc29sdmUoaW1wb3J0Lm1ldGEuZGlybmFtZSwgXCJhdHRhY2hlZF9hc3NldHNcIiksXG4gICAgfSxcbiAgfSxcbiAgZW52RGlyOiBwYXRoLnJlc29sdmUoaW1wb3J0Lm1ldGEuZGlybmFtZSksXG4gIHJvb3Q6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcImNsaWVudFwiKSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcImRpc3QvcHVibGljXCIpLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgYWxsb3dlZEhvc3RzOiBbXG4gICAgICBcIi5tYW51c3ByZS5jb21wdXRlclwiLFxuICAgICAgXCIubWFudXMuY29tcHV0ZXJcIixcbiAgICAgIFwiLm1hbnVzLWFzaWEuY29tcHV0ZXJcIixcbiAgICAgIFwiLm1hbnVzY29tcHV0ZXIuYWlcIixcbiAgICAgIFwiLm1hbnVzdm0uY29tcHV0ZXJcIixcbiAgICAgIFwibG9jYWxob3N0XCIsXG4gICAgICBcIjEyNy4wLjAuMVwiLFxuICAgIF0sXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogdHJ1ZSxcbiAgICAgIGRlbnk6IFtcIioqLy4qXCJdLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1csT0FBTyxpQkFBaUI7QUFDeFgsT0FBTyxTQUFTO0FBRWhCLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLDhCQUE4QjtBQUx2QyxJQUFNLG1DQUFtQztBQU96QyxJQUFNLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxHQUFHLHVCQUF1QixDQUFDO0FBRS9ELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBcUIsVUFBVSxLQUFLO0FBQUEsTUFDdEQsV0FBVyxLQUFLLFFBQVEsa0NBQXFCLFFBQVE7QUFBQSxNQUNyRCxXQUFXLEtBQUssUUFBUSxrQ0FBcUIsaUJBQWlCO0FBQUEsSUFDaEU7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRLEtBQUssUUFBUSxnQ0FBbUI7QUFBQSxFQUN4QyxNQUFNLEtBQUssUUFBUSxrQ0FBcUIsUUFBUTtBQUFBLEVBQ2hELE9BQU87QUFBQSxJQUNMLFFBQVEsS0FBSyxRQUFRLGtDQUFxQixhQUFhO0FBQUEsSUFDdkQsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLE1BQ1IsTUFBTSxDQUFDLE9BQU87QUFBQSxJQUNoQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
