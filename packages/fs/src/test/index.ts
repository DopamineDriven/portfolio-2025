import Fs from "@/fs/index.ts";

const fs = new Fs(process.cwd());

(async () => {
  const start = performance.now();
  const result = await fs.assetToBuffer(
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-2.png"
  );
  const end = performance.now();
  console.log(`assetToBuffer took ${end - start} ms`);
  return result;
})()
  .then(async data => {
    const cleanData = fs.cleanDataUrl(data.b64encodedData);
    fs.withWs(
      `src/test/__gen__/chess-atb.${data.extension}`,
      Buffer.from(cleanData, "base64")
    );
  })
  .catch(err => console.error(err));

(async () => {
  const start = performance.now();
  const result = await fs.assetToBufferView(
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-2.png"
  );
  const end = performance.now();
  console.log(`assetToBufferView took ${end - start} ms`);
  return result;
})()
  .then(async data => {
    const cleanData = fs.cleanDataUrl(data.b64encodedData);
    fs.withWs(
      `src/test/__gen__/chess-atbv.${data.extension}`,
      Buffer.from(cleanData, "base64")
    );
  })
  .catch(err => console.error(err));


fs.fetchRemoteWriteLocal("https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/ai/port-21.png", "src/test/__gen__/port-21")

// function gzVal() {
//   return (["application/x-gzip", "application/gzip"] as const).reduce(
//     union => union
//   );
// }

// function objVal() {
//   return (
//     ["application/octet-stream", "text/plain", "model/obj"] as const
//   ).reduce(union => union);
// }

// function tsVal() {
//   return (
//     ["text/typescript", "video/mp2t", "video/vnd.dlna.mpeg-tts"] as const
//   ).reduce(union => union);
// }

// function ttfVal() {
//   return (["application/font-sfnt", "font/ttf"] as const).reduce(
//     union => union
//   );
// }

// function zipVal() {
//   return (
//     ["application/zip", "application/x-zip-compressed"] as const
//   ).reduce(union => union);
// }

// const mimeTypeObj ={
//     aac: "audio/aac",
//     abw: "application/x-abiword",
//     apng: "image/apng",
//     arc: "application/x-freearc",
//     avif: "image/avif",
//     avi: "video/x-msvideo",
//     azw: "application/vnd.amazon.ebook",
//     bin: "application/octet-stream",
//     bmp: "image/bmp",
//     bz: "application/x-bzip",
//     bz2: "application/x-bzip2",
//     cda: "application/x-cdf",
//     cjs: "application/javascript",
//     csh: "application/x-csh",
//     css: "text/css",
//     csv: "text/csv",
//     doc: "application/msword",
//     docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     eot: "application/vnd.ms-fontobject",
//     epub: "application/epub+zip",
//     gif: "image/gif",
//     glb: "model/gltf-binary",
//     gltf: "model/gltf+json",
//     gz: gzVal(),
//     htm: "text/html",
//     html: "text/html",
//     ico: "image/vnd.microsoft.icon",
//     ics: "text/calendar",
//     jar: "application/java-archive",
//     jpeg: "image/jpeg",
//     jpg: "image/jpeg",
//     js: "text/javascript",
//     json: "application/json",
//     jsonld: "application/ld+json",
//     m3u8: "application/vnd.apple.mpegurl",
//     m4a: "audio/mp4",
//     m4v: "video/mp4",
//     md: "text/markdown",
//     mdx: "application/x-mdx",
//     mid: "audio/midi",
//     midi: "audio/x-midi",
//     mjs: "text/javascript",
//     mp3: "audio/mpeg",
//     mp4: "video/mp4",
//     mpeg: "video/mpeg",
//     mpkg: "application/vnd.apple.installer+xml",
//     ndjson: "application/x-ndjson",
//     obj: objVal(),
//     odp: "application/vnd.oasis.opendocument.presentation",
//     ods: "application/vnd.oasis.opendocument.spreadsheet",
//     odt: "application/vnd.oasis.opendocument.text",
//     oga: "audio/ogg",
//     ogg: "audio/ogg",
//     ogv: "video/ogg",
//     ogx: "application/ogg",
//     opus: "audio/ogg",
//     otf: "font/otf",
//     png: "image/png",
//     pdf: "application/pdf",
//     php: "application/x-httpd-php",
//     pkpass: "application/vnd.apple.pkpass",
//     ppt: "application/vnd.ms-powerpoint",
//     pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//     py: "text/x-python",
//     pyc: "application/x-python-code",
//     rar: "application/vnd.rar",
//     rtf: "application/rtf",
//     sh: "application/x-sh",
//     svg: "image/svg+xml",
//     tar: "application/x-tar",
//     tif: "image/tiff",
//     tiff: "image/tiff",
//     ts: tsVal(),
//     ttf: ttfVal(),
//     txt: "text/plain",
//     vsd: "application/vnd.visio",
//     vtt: "text/vtt",
//     wasm: "application/wasm",
//     wav: "audio/wav",
//     weba: "video/webm",
//     webp: "image/webp",
//     woff: "font/woff",
//     woff2: "font/woff2",
//     xhtml: "application/xhtml+xml",
//     xls: "application/vnd.ms-excel",
//     xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     xml: "application/xml",
//     xul: "application/vnd.mozilla.xul+xml",
//     zip: zipVal(),
//     "3gp": "video/3gpp",
//     "3g2": "video/3gpp2",
//     "7z": "application/x-7z-compressed"
//   } as const;

//   type MimeFront<T> = T extends `${infer U}/${string}` ? U : never;

// type V = typeof mimeTypeObj[keyof typeof mimeTypeObj]

// type _X = MimeFront<V>;
