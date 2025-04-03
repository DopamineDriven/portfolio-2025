import { Fs } from "@d0paminedriven/fs";

const fs = new Fs(process.cwd());

const dirs = fs
  .readDir("src", { recursive: true })
  .filter(t => /node_modules/g.test(t) === false)
  .filter(v => /\./g.test(v))
  .map(v => {
    return v;
  });

function outputPaths(dirs: string[]) {
  const rootArr = [
    "README.md",
    "eslint.config.mjs",
    "global.d.ts",
    "index.d.ts",
    "next-env.d.ts",
    "next.config.mjs",
    "package.json",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "tsconfig.json",
    "turbo.json"
  ];
  const fs = new Fs(process.cwd());
  const toUrls = dirs.map(
    v =>
`#### src/${v}

https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/src/${v}
`
  );
  const toRootUrls = rootArr.map(
    v =>
`#### ${v}

https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/${v}
`
  );

  fs.withWs(
    "src/utils/__generated__/project/project-md.md",
    toRootUrls.concat(toUrls).join("\n\n")
  );
}

function readFiles(files: string[]) {
  const arr = Array.of<string>();
  try {
    files
      .filter(v => /\.(png|webp|jpg|ttf|woff2|pdf|ico)$/.test(v) === false)
      .forEach(function (file) {
        const fs = new Fs(process.cwd());
        const getRaw = fs.fileToBuffer(`src/${file}`).toString("utf-8");
        const pathExtension = file.split(/\./).reverse()[0] ?? "txt";
        const t = file.split(/\./)[0] ?? "";
        // prettier-ignore
        const toInject = `
#### src/${file}
- https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/src/${file}

\`\`\`${pathExtension}

${getRaw}

\`\`\`

`
        arr.push(toInject);
        fs.withWs(`test/src/${t}.md`, toInject);
      });
  } catch (err) {
    console.error(err);
  } finally {
    return arr.join("\n\n");
  }
}

function t(dirs: string[]) {
  const fs = new Fs(process.cwd());

  const v = readFiles(dirs);
  fs.withWs(`test/agg.md`, v);
}

if (process.argv[2] === "src") {
  t(dirs);
}

outputPaths(dirs);
