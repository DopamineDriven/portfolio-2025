import { Fs } from "@d0paminedriven/fs";

const fs = new Fs(process.cwd());

const distJsFileArr = () => {
  return fs
    .readDir("dist", { recursive: true })
    .filter(p => /(\.)/g.test(p))
    .filter(p => /\.js$/g.test(p));
};
const getTargeted = <const T extends "chunk" | "source">(
  target: T,
  files: string[]
) =>
  files.filter(
    file =>
      /(chunk-)/g.test(
        file.includes("/") ? (file.split(/\//g).reverse()?.[0] ?? "") : file
      ) === (target === "chunk" ? true : false)
  );

function isFlagged<const F extends string>(file: F) {
  return /[`|'|"]+use client+[`|'|"]+[;]?/g.test(file);
}

function readFile(filePath: string) {
  return fs.fileToBuffer(filePath).toString("utf-8");
}

const isolateUseClientFlaggedFiles = (files: string[]) => {
  return files
    .map(file => {
      const fileContent = readFile(`dist/${file}`);
      const detectflag = isFlagged(fileContent);

      if (detectflag === true) {
        return [file, true] as const;
      } else return [file, false] as const;
    })
    .filter(([_files, hasUseClient]) => hasUseClient)
    .map(([file, _truthy]) => file);
};

function isolateImportsInUseClientFlaggedFiles(files: string[]) {
  return files.map(file => {
    const content = readFile(`dist/${file}`);
    const parseIt =
      // eslint-disable-next-line no-useless-escape
      /import(?:(?:(?:[ \n\t]+([^ *\n\t\{\},]+)[ \n\t]*(?:,|[ \n\t]+))?([ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)|[ \n\t]*\*[ \n\t]*as[ \n\t]+([^ \n\t\{\}]+)[ \n\t]+)from[ \n\t]*(?:['"])([^'"\n]+)(['"])/g.exec(
        content
      );
    return parseIt;
  });
}

const getIsolatedChunkFiles = () =>
  isolateImportsInUseClientFlaggedFiles(
    isolateUseClientFlaggedFiles(getTargeted("source", distJsFileArr()))
  ).map(o => o?.[4]?.split(/\//g)?.reverse()?.[0] ?? "") ?? Array.of<string>();

const isolateChunkPaths = () => {
  const arrHelper = Array.of<string>();
  getIsolatedChunkFiles().forEach(function (chunk) {
    const targetedFileNames = getTargeted("chunk", distJsFileArr());

    return targetedFileNames
      .filter(targeted => targeted.includes(chunk))
      .map(t => {
        arrHelper.push(`dist/${t}`);
        return `dist/${t}`;
      });
  });
  return arrHelper;
};

function prependClient(fileContent: string) {
  if (isFlagged(fileContent) === false) {
    return `"use client";\n`.concat(fileContent);
  } else return fileContent;
}

function handleUseClientInjectionOfRelevantChunks(files: string[]) {
  return files.map(file => {
    const fileContent = readFile(file);
    fs.withWs(file, prependClient(fileContent));
    return prependClient(fileContent);
  });
}
// tsx src/services/postbuild.ts flag-check
if (process.argv[2] === "flag-check") {
  handleUseClientInjectionOfRelevantChunks(isolateChunkPaths());
}
