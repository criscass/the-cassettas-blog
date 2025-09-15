import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import remarkImageCaptions from "./src/lib/remark-image-captions.js";

export default defineConfig({
  i18n: {
    defaultLocale: "it",
    locales: ["it", "en"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  site: "http://www.cassettas-reboot.xyz/",
  integrations: [tailwind(), sitemap(), mdx(), pagefind()],
  markdown: {
    remarkPlugins: [remarkImageCaptions],
    shikiConfig: {
      theme: "css-variables",
    },
  },
});