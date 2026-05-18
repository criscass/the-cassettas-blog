import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../");
const PORT = 3001;

const app = express();
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.array("images"), async (req, res) => {
  const results = [];
  for (const file of req.files) {
    const safeName = file.originalname.replace(/[^a-z0-9._-]/gi, "-").replace(/\.[^.]+$/, "") + ".jpg";
    const resized = await sharp(file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    results.push({ originalName: file.originalname, safeName, data: resized.toString("base64") });
  }
  res.json({ images: results });
});

app.get("/next-post-number", (req, res) => {
  const itDir = path.join(ROOT, "src/content/blog/it");
  const folders = fs.readdirSync(itDir).filter((f) => /^post-\d+$/.test(f));
  const nums = folders.map((f) => parseInt(f.replace("post-", ""), 10));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  res.json({ next });
});

app.post("/create", async (req, res) => {
  try {
    const { postNumber, titleIT, descriptionIT, titleEN, descriptionEN, dateStr, bodyWithImages, bodyEN } = req.body;

    const num = parseInt(postNumber, 10);
    const paddedNum = String(num).padStart(5, "0");
    const folderName = `post-${paddedNum}`;
    const imgFolderName = `post-${num}`;
    const imgRelPath = `../../../../assets/images/${imgFolderName}`;

    function buildMarkdownBody(parts) {
      return parts
        .map((part) => {
          if (part.type === "text") return part.content;
          if (part.type === "image") {
            const alt = part.alt || part.safeName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
            const img = `![${alt}](${imgRelPath}/${part.safeName})`;
            return part.caption ? `\n${img}\n_${part.caption}_\n` : `\n${img}\n`;
          }
          return "";
        })
        .join("\n");
    }

    const bodyIT = buildMarkdownBody(bodyWithImages);

    // Insert images into EN body at the same paragraph positions as IT
    const bodyENWithImages = insertImagesIntoBody(bodyEN, bodyWithImages, imgRelPath);

    // Save images
    const imgDir = path.join(ROOT, "src/assets/images", imgFolderName);
    fs.mkdirSync(imgDir, { recursive: true });
    for (const part of bodyWithImages) {
      if (part.type === "image") {
        fs.writeFileSync(path.join(imgDir, part.safeName), Buffer.from(part.data, "base64"));
      }
    }

    // Write IT index.md
    const itDir = path.join(ROOT, "src/content/blog/it", folderName);
    fs.mkdirSync(itDir, { recursive: true });
    fs.writeFileSync(path.join(itDir, "index.md"), buildIndexMd({ title: titleIT, description: descriptionIT, date: dateStr, language: "it", body: bodyIT }));

    // Write EN index.md
    const enDir = path.join(ROOT, "src/content/blog/en", folderName);
    fs.mkdirSync(enDir, { recursive: true });
    fs.writeFileSync(path.join(enDir, "index.md"), buildIndexMd({ title: titleEN, description: descriptionEN, date: dateStr, language: "en", body: bodyENWithImages }));

    res.json({
      success: true,
      files: {
        it: `src/content/blog/it/${folderName}/index.md`,
        en: `src/content/blog/en/${folderName}/index.md`,
        images: `src/assets/images/${imgFolderName}/`,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Insert images into EN plain text at the same paragraph-index positions as in the IT composer.
function insertImagesIntoBody(bodyEN, bodyWithImages, imgRelPath) {
  const enParas = bodyEN.trim().split(/\n{2,}/);
  const result = [];
  let paraIndex = 0;

  for (const part of bodyWithImages) {
    if (part.type === "text") {
      if (paraIndex < enParas.length) result.push(enParas[paraIndex++]);
    } else if (part.type === "image") {
      const alt = part.alt || part.safeName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const imgMd = `\n![${alt}](${imgRelPath}/${part.safeName})`;
      result.push(part.caption ? `${imgMd}\n_${part.caption}_\n` : `${imgMd}\n`);
    }
  }

  // Append any remaining EN paragraphs that didn't have IT counterparts
  while (paraIndex < enParas.length) result.push(enParas[paraIndex++]);

  return result.join("\n\n");
}

function buildIndexMd({ title, description, date, language, body }) {
  return `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
date: "${date}"
draft: false
language: "${language}"
---

${body.trim()}
`;
}

app.listen(PORT, () => {
  console.log(`\nPost creator running at http://localhost:${PORT}\n`);
  exec(`open http://localhost:${PORT}`);
});
