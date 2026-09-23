import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
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
