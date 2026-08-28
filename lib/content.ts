/**
 * Server-side loaders: content/*.md (frontmatter + styled markdown) →
 * the typed shapes the UI sections consume. Markdown is the single source
 * of truth — the same files feed the RAG embedding pipeline in CI.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type {
  Education,
  Experience,
  HomelabService,
  Project,
} from "./content-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

interface MdFile {
  name: string;
  data: Record<string, any>;
  body: string;
}

function readDir(sub: string): MdFile[] {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((name) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(dir, name), "utf8"),
      );
      return { name, data, body: content };
    });
}

/** Splits body into intro (text after the H1) and `## Section` blocks. */
function splitSections(body: string): {
  intro: string;
  sections: Record<string, string>;
} {
  const lines = body.split("\n");
  const sections: Record<string, string> = {};
  let current = "__intro__";
  const buf: Record<string, string[]> = { __intro__: [] };
  for (const line of lines) {
    if (line.startsWith("# ") && current === "__intro__") continue; // H1 title
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      current = h2[1].trim();
      buf[current] = [];
      continue;
    }
    buf[current].push(line);
  }
  for (const [k, v] of Object.entries(buf)) {
    if (k !== "__intro__") sections[k] = v.join("\n").trim();
  }
  return { intro: buf.__intro__.join("\n").trim(), sections };
}

function bullets(section?: string): string[] | undefined {
  if (!section) return undefined;
  const items = section
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
  return items.length ? items : undefined;
}

export function getProjects(): Project[] {
  return readDir("projects").map(({ data, body }) => {
    const { intro, sections } = splitSections(body);
    return {
      id: data.id,
      title: data.title,
      description: intro,
      technologies: data.technologies ?? [],
      github: data.github,
      liveDemo: data.liveDemo,
      status: data.status,
      challenges: bullets(sections["Challenges"]),
      solutions: bullets(sections["Solutions"]),
      generalFeatures: bullets(sections["Features"]),
      myContributions: bullets(sections["My Contributions"]),
      results: bullets(sections["Results"]),
    };
  });
}

export function getExperiences(): Experience[] {
  return readDir("experience")
    .map(({ name, data, body }) => {
      const { intro, sections } = splitSections(body);
      return {
        order: Number(data.order ?? 0),
        exp: {
          id: name.replace(/^\d+-/, "").replace(/\.md$/, ""),
          role: data.title,
          company: data.company,
          companyLogo: data.logo,
          period: data.period,
          description: intro,
          achievements: bullets(sections["Achievements"]),
          technologies: data.technologies,
        } satisfies Experience,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map(({ exp }) => exp);
}

export function getEducation(): Education[] {
  return readDir("education").map(({ name, data, body }) => {
    const { intro, sections } = splitSections(body);
    const [start, end] = String(data.period ?? "").split(" - ");
    return {
      id: name.replace(/^\d+-/, "").replace(/\.md$/, ""),
      school: data.school,
      logo: data.logo,
      degree: data.degree,
      field: data.field,
      start: data.start ?? start ?? "",
      end: data.end ?? end ?? "",
      info: data.info ?? intro,
      courseWork: bullets(sections["Coursework"]) ?? [],
    };
  });
}

export function getHomelabServices(): HomelabService[] {
  return readDir("homelab").map(({ data, body }) => {
    const { intro, sections } = splitSections(body);
    return {
      id: data.id,
      title: data.title,
      description: intro,
      icon: data.icon,
      category: data.category,
      technologies: data.technologies ?? [],
      features: bullets(sections["Features"]) ?? [],
    };
  });
}
