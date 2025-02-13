import { Fs } from "@d0paminedriven/fs";
import { parse } from "yaml";
import { PostDetails } from "@/types/posts";
import { ProjectDetail } from "@/types/projects";

export class PrebuildService extends Fs {
  public parseFrontMatter = /^---[\r\n]+([\s\S]*?)[\r\n]+---/;
  constructor(public override cwd: string) {
    super((cwd ??= process.cwd()));
  }

  public postPaths<const T extends "posts" | "projects">(target: T) {
    return this.readDir(`src/content/${target}`, { recursive: true }).map(
      t => t
    );
  }

  public handleArrOrArrOfArr(props: string[] | string[][]) {
    return props.map(x => {
      if (Array.isArray(x)) {
        const yamlWorkup = x.join("\n");

        const y = parse(yamlWorkup) as unknown;
        console.log(y);
        return y;
      } else return parse(x) as unknown;
    });
  }

  public getFileContent<const T extends "posts" | "projects">(
    target: T,
    slug: string
  ) {
    return this.fileToBuffer(`src/content/${target}/${slug}.mdx`)
      .toString("utf-8")
      .replace(this.parseFrontMatter, "");
  }

  public aggregateData(argv: string[]) {
    if (argv[2] === "posts") {
      return this.postPaths("posts").map(path => {
        return (
          this.parseFrontMatter.exec(
            this.fileToBuffer(`src/content/posts/${path}`).toString("utf-8")
          )?.[0] ?? ""
        );
      });
    } else {
      return this.postPaths("projects").map(path => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.parseFrontMatter
            .exec(
              this.fileToBuffer(`src/content/projects/${path}`).toString(
                "utf-8"
              )
            )![0]!
            .split(`\n`)!
            .filter(v => v && !v.startsWith("---"))!
            .join("\n")!
        );
      });
    }
  }
}

const p = new PrebuildService(process.cwd());

const m = (argv: string[]) => {
  const argv2 = argv[2];
  return p
    .aggregateData(argv)
    .map(x => {
      if (Array.isArray(x)) {
        const yamlWorkup = x.join("\n");

        return parse(yamlWorkup) as unknown;
      } else return parse(x) as unknown;
    })
    .map(t => {
      if (argv2 === "posts") {
        const post = t as Omit<PostDetails, "content">;
        const content = p.getFileContent("posts", post.slug).trimStart();
        return {
          ...post,
          content: content
        } as PostDetails;
      } else {
        const project = t as Omit<ProjectDetail, "content">;
        const content = p.getFileContent("projects", project.slug).trimStart();
        return {
          ...project,
          content: content
        } as ProjectDetail;
      }
    })
    .sort((a, b) => Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10));
};

// const invoked = () =>  m(process.argv);

if (process.argv[2] === "posts") {
  p.withWs(
    "src/__generated__/get-posts.ts",
    `export const getPosts = ${JSON.stringify(m(process.argv), null, 2)}`
  );
}

if (process.argv[2] === "projects") {
  p.withWs(
    "src/__generated__/get-projects.ts",
    `export const getProjects = ${JSON.stringify(m(process.argv), null, 2)}`
  );
}
