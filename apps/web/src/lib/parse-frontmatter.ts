import { Fs } from "@d0paminedriven/fs";
import type { PostDetails } from "@/types/posts";
import type { ProjectDetail } from "@/types/projects";

export const omitFrontMatter = <const T extends string>(frontMatter: T) => {
  return frontMatter.replace(/^---[\r\n]+([\s\S]*?)[\r\n]+---/g, "");
};

export function getMdxPaths<const T extends "posts" | "projects">(target: T) {
  const fs = new Fs(process.cwd());
  return fs.readDir(`src/content/${target}`);
}

export function readMdxFile<
  const T extends "posts" | "projects",
  const P extends string
>(target: T, path: P) {
  const fs = new Fs(process.cwd());
  return fs.fileToBuffer(`src/content/${target}/${path}`).toString("utf-8");
}

export function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /^---[\r\n]+([\s\S]*?)[\r\n]+---/g;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match?.[1] ?? "";
  const content = omitFrontMatter(fileContent).trimStart();
  const metadata: Record<string, string | string[]> = {};
  let currentKey: string | null = null;
  const lines = frontMatterBlock.split(/\r?\n/);
  for (const line of lines) {
    const keyValMatch = /^([\w-]+)\s*:\s*(.*)?$/.exec(line);

    if (keyValMatch) {
      const [_e, rawKey, rawVal] = keyValMatch;
      const key = rawKey?.trim() ?? "";
      const val = (rawVal ?? "").trim();

      if (!val) {
        metadata[key] = [];
        currentKey = key;
      } else {
        metadata[key] = val.replace(/^['"](.*)['"]$/, "$1");
        currentKey = null;
      }
    } else {
      const arrayItemMatch = /^-\s*(.*)$/.exec(line.trim());
      if (arrayItemMatch) {
        const itemValue = arrayItemMatch[1] ?? "";
        // clean assertion in next step
        (metadata[currentKey ?? ""] as string[]).push(itemValue);
      }
    }
  }
  const frontMatterCleanup = Object.entries(metadata).map(([key, val]) => {
    if (Array.isArray(val)) {
      // clean asserted array items
      const cleanedArray = val.map(item =>
        item.replace(/^['"](.*)['"]$/, "$1")
      );
      return [key, cleanedArray];
    } else {
      const cleanedString = val.replace(/^['"](.*)['"]$/, "$1");
      return [key, cleanedString];
    }
  });

  const toCleanFrontMatterObj = Object.fromEntries(
    frontMatterCleanup as [string, string | string[]][]
  ) as Omit<ProjectDetail | PostDetails, "content">;

  return { frontMatter: toCleanFrontMatterObj, content };
}

export type GetMdxDataReturnType<V extends "posts" | "projects"> = {
  content: string;
  frontMatter: V extends "posts"
    ? Omit<PostDetails, "content">
    : Omit<ProjectDetail, "content">;
};

export function getMdxData<
  const V extends "posts" | "projects",
  const T extends string
>(target: V, slug: T): GetMdxDataReturnType<V> {
  if (target === "posts") {
    return parseFrontmatter(
      readMdxFile(target, `${slug}.mdx`)
    ) as GetMdxDataReturnType<typeof target>;
  } else
    return parseFrontmatter(
      readMdxFile(target, `${slug}.mdx`)
    ) as GetMdxDataReturnType<typeof target>;
}

export async function getAllProjects() {
  const proyectos = getMdxPaths("projects");
  const projects = await Promise.all(
    proyectos.map(filename => {
      const file = getMdxData("projects", filename.replace(/\.mdx$/, ""));
      const { frontMatter, content } = file;
      return {
        ...frontMatter,
        content
      };
    })
  );
  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getAllPosts() {
  const postPaths = getMdxPaths("posts");
  const posts = await Promise.all(
    postPaths.map(filename => {
      const file = getMdxData("posts", filename.replace(/\.mdx$/, ""));
      const { frontMatter, content } = file;
      return {
        ...frontMatter,
        content
      };
    })
  );
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export const complexPropParser = <
  const V extends Record<string | number | symbol, unknown>,
  const T extends keyof V
>(
  attrs: Record<string, string | null | undefined> | null | undefined,
  keys: readonly T[]
) => {
  const a = { ...attrs };
  for (const key of keys) {
    if (key in a && a && typeof key === "string")
      (a[key] as unknown as V[T]) = JSON.parse(a[key] ?? "") as V[T];
  }
  return a;
};
