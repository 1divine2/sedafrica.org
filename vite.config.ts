import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        admin: resolve("admin.html"),
        education: resolve("education.html"),
        agriculture: resolve("agriculture.html"),
        genderChildren: resolve("gender-children.html"),
        communityEmpowerment: resolve("community-empowerment.html"),
        privacyPolicy: resolve("privacy-policy.html"),
        termsConditions: resolve("terms-conditions.html"),
        cookiePolicy: resolve("cookie-policy.html"),
      },
    },
  },
});
