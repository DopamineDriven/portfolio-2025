import { getSiteUrl } from "@/lib/site-url";

export const domainWorkup = (
  url:
    | "https://dev.asross.com"
    | "http://localhost:3008"
    | "https://www.asross.com"
) => {
  const omitProtocol =
    url
      .split(/(https?:\/\/)/g)
      ?.filter(t => t.length > 1)
      ?.filter(t => /(https?:\/\/)/g.test(t) === false)?.[0] ?? "";
  return /(?:(localhost:)[0-9]{3,4}$)/g.test(omitProtocol)
    ? "localhost"
    : /(:?asross\.com)/g.test(omitProtocol)
      ? "asross.com"
      : (process.env.VERCEL_URL ?? "");
};

export const getDomain = domainWorkup(getSiteUrl(process.env.NODE_ENV));

export const getCookieDomain = () => {
  const domain = domainWorkup(getSiteUrl(process.env.NODE_ENV));
  // leading dot for cookie domain so it works across subdomains
  if (domain === "asross.com") return ".asross.com";
  else if (domain === "localhost") return "localhost";
  else return domain;
};
