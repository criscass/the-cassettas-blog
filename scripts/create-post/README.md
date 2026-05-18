# New Post Tool

A local web app for creating new bilingual blog posts (Italian + English).

## Usage

```sh
npm run new-post
```

Your browser opens at `http://localhost:3001`. Fill in the form:

1. **Post number** — auto-detected as the next available number
2. **Date** — defaults to today
3. **Title & Description** — in both Italian and English
4. **Italian body** — paste from Google Docs, then click **"Build Composer"**
5. **Drag images** from the tray on the right and drop them between paragraphs
6. **English body** — paste your translation
7. Click **"Create Post"**

The tool will:
- Resize all images to max 1200px wide (JPEG quality 80)
- Create `src/content/blog/it/post-XXXXX/index.md`
- Create `src/content/blog/en/post-XXXXX/index.md` (images inserted at same paragraph positions as Italian)
- Save images to `src/assets/images/post-N/`

## Notes

- Image files are renamed to be URL-safe (special characters removed)
- The English body is a translation of the Italian — review it before publishing
- Set `draft: true` in the generated files if you want to review before the post goes live
