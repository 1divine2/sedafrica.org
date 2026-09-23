import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        admin: resolve(root, "admin.html"),
        education: resolve(root, "education.html"),
        agriculture: resolve(root, "agriculture.html"),
        genderChildren: resolve(root, "gender-children.html"),
        communityEmpowerment: resolve(root, "community-empowerment.html"),
        privacyPolicy: resolve(root, "privacy-policy.html"),
        termsConditions: resolve(root, "terms-conditions.html"),
        cookiePolicy: resolve(root, "cookie-policy.html"),
      },
    },
  },
});
