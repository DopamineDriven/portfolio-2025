import { Fs } from "@d0paminedriven/fs";

export class SitemapService extends Fs {
  constructor(
    public countries: typeof import("@/utils/flags").flags,
    public override cwd: string
  ) {
    super((cwd ??= process.cwd()));
  }
  public get productionUrl() {
    return "https://www.nextchessbot.com" as const;
  }
  public get previewUrl() {
    return "https://dev.nextchessbot.com" as const;
  }
  public get localUrl() {
    return "http://localhost:3010" as const;
  }

  public get siteUrl() {
    return process.env.VERCEL_ENV === "production"
      ? this.productionUrl
      : process.env.VERCEL_ENV === "preview"
        ? this.previewUrl
        : process.env.NODE_ENV === "development"
          ? this.localUrl
          : this.localUrl;
  }

  get nested() {
    return this.countries.map(country => {
      return `${country}`;
    });
  }

  public mapper = (data: string[]) =>
    data.map(path => {
      return path.length < 1
        ? this.siteUrl
        : (`${this.siteUrl}/${path}` as const);
    });

  public getPublicData() {
    return this.readDir("public", { recursive: true })
      .filter(entry => /\./gi.test(entry) === true)
      .map(entry => `${entry}`);
  }

  get allPaths() {
    return this.mapper(
      [
        "robots.txt",
        "apple-icon.png",
        "favicon.ico",
        "manifest.webmanifest",
        ""
      ]
        .concat(this.nested)
        .concat(this.getPublicData())
    ).sort((a, b) => a.localeCompare(b) - b.localeCompare(a));
  }

  public templatedData(allPaths: string[]) {
    return allPaths
      .map(path => {
        // prettier-ignore
        return  `<url><loc>${path}</loc><lastmod>${new Date(Date.now()).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`
      })
      .join("\n");
  }

  public templated() {
    // prettier-ignore
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${this.templatedData(this.allPaths)}
</urlset>` as const
  }

  public wait<const T extends number>(ms: T) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public exe() {
    this.withWs("public/sitemap.xml", this.templated());
  }
}
/**
 xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
xmlns:xhtml="http://www.w3.org/1999/xhtml"
xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
 */
