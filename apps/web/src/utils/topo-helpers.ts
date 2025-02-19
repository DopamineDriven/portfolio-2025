import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";

const isoHelper = new Iso3166_1();

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

export function countryCodeToArrOutput(
  target: string,
  isoHelper: InstanceType<typeof Iso3166_1>,
  withCountryCode = false
) {
  if (target === "001") {
    const flagUrl =
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/en.svg";
    const quasiAlpha2 = "EN";
    const quasiAlpha3 = "EAR";
    const quasiCountryName = "Earth";
    const quasiCountryCode = "001";
    return withCountryCode === true
      ? ([
          quasiAlpha2,
          quasiAlpha3,
          quasiCountryName,
          flagUrl,
          quasiCountryCode
        ] as [string, string, string, string, string])
      : ([quasiAlpha2, quasiAlpha3, quasiCountryName, flagUrl] as [
          string,
          string,
          string,
          string
        ]);
  }
  if (withCountryCode === true) {
    const [alpha2, alpha3, countryName, countryFlag] =
      isoHelper.parseCountryDataAndFlag(target);
    return [alpha2, alpha3, countryName, countryFlag, target] as [
      string,
      string,
      string,
      string,
      string
    ];
  } else
    return isoHelper.parseCountryDataAndFlag(target) as [
      string,
      string,
      string,
      string
    ];
}

console.log(countryCodeToObjOutput("004", isoHelper));

console.log(countryCodeToArrOutput("004", isoHelper, true));
