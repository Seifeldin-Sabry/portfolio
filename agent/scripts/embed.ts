/**
 * Incremental embedding pipeline (CI):
 *   1. Walk content/**, data/blogs/**, cv/** markdown.
 *   2. sha256 per file, diff against content_hashes table.
 *   3. Changed files → MDocument markdown chunking → Workers AI embeddings
 *      → replace rows in portfolio_chunks (delete + insert, ids `${file}#${i}`).
 *   4. Deleted files → purge chunks + hash.
 * No-op when nothing changed.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { MDocument } from "@mastra/rag";
import { neon } from "@neondatabase/serverless";
import matter from "gray-matter";

import { embedTexts, toVectorLiteral } from "../src/lib/embeddings";

const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCES = ["content", "data/blogs", "cv"];
const EXTENSIONS = new Set([".md", ".mdx"]);

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (EXTENSIONS.has(path.extname(entry.name))) out.push(p);
  }
  return out;
}

async function main() {
  const sql = neon(process.env.POSTGRES_CONNECTION_STRING!);

  const files = SOURCES.flatMap((s) => walk(path.join(REPO_ROOT, s))).map(
    (abs) => path.relative(REPO_ROOT, abs),
  );

  const hashRows = (await sql`SELECT file, sha256 FROM content_hashes`) as {
    file: string;
    sha256: string;
  }[];
  const known = new Map(hashRows.map((r) => [r.file, r.sha256]));

  let changed = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(REPO_ROOT, file), "utf8");
    const sha = createHash("sha256").update(raw).digest("hex");
    if (known.get(file) === sha) {
      known.delete(file);
      continue;
    }
    known.delete(file);
    changed++;

    const { data: fmData, content } = matter(raw);
    const title = typeof fmData.title === "string" ? fmData.title : path.basename(file);
    const doc = MDocument.fromMarkdown(content, { file, title });
    const chunks = await doc.chunk({ strategy: "recursive", maxSize: 900, overlap: 120 });
    const texts = chunks.map((c) => `[${title}] ${c.text}`);
    const vectors = await embedTexts(texts);

    await sql`DELETE FROM portfolio_chunks WHERE file = ${file}`;
    for (let i = 0; i < texts.length; i++) {
      await sql`
        INSERT INTO portfolio_chunks (id, file, chunk_index, text, embedding)
        VALUES (${`${file}#${i}`}, ${file}, ${i}, ${texts[i]}, ${toVectorLiteral(vectors[i])}::vector)
        ON CONFLICT (id) DO UPDATE
          SET text = EXCLUDED.text, embedding = EXCLUDED.embedding, updated_at = now()
      `;
    }
    await sql`
      INSERT INTO content_hashes (file, sha256, chunk_count)
      VALUES (${file}, ${sha}, ${texts.length})
      ON CONFLICT (file) DO UPDATE
        SET sha256 = EXCLUDED.sha256, chunk_count = EXCLUDED.chunk_count, updated_at = now()
    `;
    console.log(`embedded ${file} (${texts.length} chunks)`);
  }

  // anything left in `known` no longer exists on disk
  for (const [file] of known) {
    await sql`DELETE FROM portfolio_chunks WHERE file = ${file}`;
    await sql`DELETE FROM content_hashes WHERE file = ${file}`;
    changed++;
    console.log(`purged ${file}`);
  }

  console.log(changed === 0 ? "no content changes — skipped" : `done, ${changed} file(s) updated`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
