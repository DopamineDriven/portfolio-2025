import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";

export function countryCodeToObjOutput(
  target: string,
  isoHelper: InstanceType<typeof Iso3166_1>
): {
  alpha2: string;
  alpha3: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
} {
  if (target === "001") {
    const flagUrl =
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/en.svg";
    const quasiAlpha2 = "EN";
    const quasiAlpha3 = "EAR";
    const quasiCountryName = "Earth";
    const quasiCountryCode = "001";
    return {
      alpha2: quasiAlpha2,
      alpha3: quasiAlpha3,
      countryCode: quasiCountryCode,
      countryName: quasiCountryName,
      countryFlag: flagUrl
    };
  }
  const [alpha2, alpha3, countryName, countryFlag] =
    isoHelper.parseCountryDataAndFlag(target);
  return {
    alpha2,
    alpha3,
    countryCode: target,
    countryName,
    countryFlag
  };
}
