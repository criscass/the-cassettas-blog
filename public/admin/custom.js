// Rewrite image paths and convert titles to captions on save
CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    const postNumber = entry.get('post_number');
    if (!postNumber) return entry;

    // Use the exact post number (keeps leading zeros) to match upload folder
    const postFolder = `post-${String(postNumber)}`;

    const body = entry.get('body') || '';
    const IMAGE_REGEX = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;

    const ASSETS_BASE = '../../../../assets/images';

    const transformed = body.replace(IMAGE_REGEX, (match, alt, url, title) => {
      // Only touch local assets; leave external URLs intact
      const isExternal = /^(https?:)?\/\//i.test(url);
      if (isExternal) return match;

      const filename = url.split('/').pop();
      if (!filename) return match;

      const newUrl = `${ASSETS_BASE}/${postFolder}/${filename}`;

      // If a title is present, remove it from the image and add italic caption below
      if (title && title.trim()) {
        return `![${alt}](${newUrl})\n_${title.trim()}_`;
      }

      // Otherwise just rewrite the path
      return `![${alt}](${newUrl})`;
    });

    return entry.set('body', transformed);
  },
});