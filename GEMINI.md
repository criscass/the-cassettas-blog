# The Cassetta's Blog - GEMINI.md

## Project Overview
This is a personal blog built using **Astro 5** and **Tailwind CSS**. It features multi-language support (Italian and English) and uses **MDX** for content management. Search functionality is powered by **Pagefind**.

### Key Technologies
- **Framework:** [Astro](https://astro.build/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Content:** [Astro Collections](https://docs.astro.build/en/guides/content-collections/) with MDX
- **Search:** [Pagefind](https://pagefind.app/)
- **i18n:** Built-in Astro i18n support

## Directory Structure
- `src/content/blog/`: Contains the blog posts organized by language (`en/`, `it/`).
- `src/assets/images/`: Stores images for blog posts, organized by post ID (e.g., `post-49/`).
- `src/components/`: Reusable Astro components.
- `src/layouts/`: Page layouts (e.g., `Layout.astro`).
- `src/pages/`: Page routes, including localized routes for `en/` and `it/`.
- `src/lib/`: Utility functions and custom Remark/Rehype plugins.

## Building and Running
- **Development:** `npm run dev` or `npm run start`
- **Build:** `npm run build` (Runs Astro check and build)
- **Preview:** `npm run preview`
- **Linting/Formatting:** Prettier is used for formatting (`.prettierrc.mjs`).

## Development Conventions

### Blog Post Structure
- **Location:** `src/content/blog/[lang]/post-XXXXX/index.md`
- **Images:** `src/assets/images/post-X/`
- **MDX Frontmatter:**
  ```yaml
  ---
  title: "Your Post Title"
  description: "A brief description"
  date: "YYYY-MM-DD"
  draft: false
  language: "en" # or "it"
  ---
  ```
- **Image Referencing:**
  Use relative paths: `![Alt text](../../../../assets/images/post-X/pic-Y.jpg "Caption text")`
  *Note: A custom Remark plugin (`src/lib/remark-image-captions.js`) converts the image title into an italicized caption below the image.*

### Routing
- Default locale: `it`
- Localized paths: `/it/...` and `/en/...`
- Slugs are formatted using `formatSlug` from `@lib/utils`.

### Styles
- Global styles are in `src/styles/global.css`.
- Tailwind CSS is used for component-level styling.
