import { Fs } from "@d0paminedriven/fs";
import { whereNumeric } from "iso-3166-1";

type Country = {
  country: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
};

export const topojsonCountryData = [
  ["242", "Fiji", "MultiPolygon"],
  ["834", "Tanzania", "Polygon"],
  ["732", "W. Sahara", "Polygon"],
  ["124", "Canada", "MultiPolygon"],
  ["840", "United States of America", "MultiPolygon"],
  ["398", "Kazakhstan", "Polygon"],
  ["860", "Uzbekistan", "Polygon"],
  ["598", "Papua New Guinea", "MultiPolygon"],
  ["360", "Indonesia", "MultiPolygon"],
  ["032", "Argentina", "MultiPolygon"],
  ["152", "Chile", "MultiPolygon"],
  ["180", "Dem. Rep. Congo", "Polygon"],
  ["706", "Somalia", "Polygon"],
  ["404", "Kenya", "Polygon"],
  ["729", "Sudan", "Polygon"],
  ["148", "Chad", "Polygon"],
  ["332", "Haiti", "Polygon"],
  ["214", "Dominican Rep.", "Polygon"],
  ["643", "Russia", "MultiPolygon"],
  ["044", "Bahamas", "MultiPolygon"],
  ["238", "Falkland Is.", "Polygon"],
  ["578", "Norway", "MultiPolygon"],
  ["304", "Greenland", "Polygon"],
  ["260", "Fr. S. Antarctic Lands", "Polygon"],
  ["626", "Timor-Leste", "Polygon"],
  ["710", "South Africa", "Polygon"],
  ["426", "Lesotho", "Polygon"],
  ["484", "Mexico", "Polygon"],
  ["858", "Uruguay", "Polygon"],
  ["076", "Brazil", "Polygon"],
  ["068", "Bolivia", "Polygon"],
  ["604", "Peru", "Polygon"],
  ["170", "Colombia", "Polygon"],
  ["591", "Panama", "Polygon"],
  ["188", "Costa Rica", "Polygon"],
  ["558", "Nicaragua", "Polygon"],
  ["340", "Honduras", "Polygon"],
  ["222", "El Salvador", "Polygon"],
  ["320", "Guatemala", "Polygon"],
  ["084", "Belize", "Polygon"],
  ["862", "Venezuela", "Polygon"],
  ["328", "Guyana", "Polygon"],
  ["740", "Suriname", "Polygon"],
  ["250", "France", "MultiPolygon"],
  ["218", "Ecuador", "Polygon"],
  ["630", "Puerto Rico", "Polygon"],
  ["388", "Jamaica", "Polygon"],
  ["192", "Cuba", "Polygon"],
  ["716", "Zimbabwe", "Polygon"],
  ["072", "Botswana", "Polygon"],
  ["516", "Namibia", "Polygon"],
  ["686", "Senegal", "Polygon"],
  ["466", "Mali", "Polygon"],
  ["478", "Mauritania", "Polygon"],
  ["204", "Benin", "Polygon"],
  ["562", "Niger", "Polygon"],
  ["566", "Nigeria", "Polygon"],
  ["120", "Cameroon", "Polygon"],
  ["768", "Togo", "Polygon"],
  ["288", "Ghana", "Polygon"],
  ["384", "Côte d'Ivoire", "Polygon"],
  ["324", "Guinea", "Polygon"],
  ["624", "Guinea-Bissau", "Polygon"],
  ["430", "Liberia", "Polygon"],
  ["694", "Sierra Leone", "Polygon"],
  ["854", "Burkina Faso", "Polygon"],
  ["140", "Central African Rep.", "Polygon"],
  ["178", "Congo", "Polygon"],
  ["266", "Gabon", "Polygon"],
  ["226", "Eq. Guinea", "Polygon"],
  ["894", "Zambia", "Polygon"],
  ["454", "Malawi", "Polygon"],
  ["508", "Mozambique", "Polygon"],
  ["748", "eSwatini", "Polygon"],
  ["024", "Angola", "MultiPolygon"],
  ["108", "Burundi", "Polygon"],
  ["376", "Israel", "Polygon"],
  ["422", "Lebanon", "Polygon"],
  ["450", "Madagascar", "Polygon"],
  ["275", "Palestine", "Polygon"],
  ["270", "Gambia", "Polygon"],
  ["788", "Tunisia", "Polygon"],
  ["012", "Algeria", "Polygon"],
  ["400", "Jordan", "Polygon"],
  ["784", "United Arab Emirates", "Polygon"],
  ["634", "Qatar", "Polygon"],
  ["414", "Kuwait", "Polygon"],
  ["368", "Iraq", "Polygon"],
  ["512", "Oman", "MultiPolygon"],
  ["548", "Vanuatu", "MultiPolygon"],
  ["116", "Cambodia", "Polygon"],
  ["764", "Thailand", "Polygon"],
  ["418", "Laos", "Polygon"],
  ["104", "Myanmar", "Polygon"],
  ["704", "Vietnam", "Polygon"],
  ["408", "North Korea", "MultiPolygon"],
  ["410", "South Korea", "Polygon"],
  ["496", "Mongolia", "Polygon"],
  ["356", "India", "Polygon"],
  ["050", "Bangladesh", "Polygon"],
  ["064", "Bhutan", "Polygon"],
  ["524", "Nepal", "Polygon"],
  ["586", "Pakistan", "Polygon"],
  ["004", "Afghanistan", "Polygon"],
  ["762", "Tajikistan", "Polygon"],
  ["417", "Kyrgyzstan", "Polygon"],
  ["795", "Turkmenistan", "Polygon"],
  ["364", "Iran", "Polygon"],
  ["760", "Syria", "Polygon"],
  ["051", "Armenia", "Polygon"],
  ["752", "Sweden", "Polygon"],
  ["112", "Belarus", "Polygon"],
  ["804", "Ukraine", "Polygon"],
  ["616", "Poland", "Polygon"],
  ["040", "Austria", "Polygon"],
  ["348", "Hungary", "Polygon"],
  ["498", "Moldova", "Polygon"],
  ["642", "Romania", "Polygon"],
  ["440", "Lithuania", "Polygon"],
  ["428", "Latvia", "Polygon"],
  ["233", "Estonia", "Polygon"],
  ["276", "Germany", "Polygon"],
  ["100", "Bulgaria", "Polygon"],
  ["300", "Greece", "MultiPolygon"],
  ["792", "Turkey", "MultiPolygon"],
  ["008", "Albania", "Polygon"],
  ["191", "Croatia", "Polygon"],
  ["756", "Switzerland", "Polygon"],
  ["442", "Luxembourg", "Polygon"],
  ["056", "Belgium", "Polygon"],
  ["528", "Netherlands", "Polygon"],
  ["620", "Portugal", "Polygon"],
  ["724", "Spain", "Polygon"],
  ["372", "Ireland", "Polygon"],
  ["540", "New Caledonia", "Polygon"],
  ["090", "Solomon Is.", "MultiPolygon"],
  ["554", "New Zealand", "MultiPolygon"],
  ["036", "Australia", "MultiPolygon"],
  ["144", "Sri Lanka", "Polygon"],
  ["156", "China", "MultiPolygon"],
  ["158", "Taiwan", "Polygon"],
  ["380", "Italy", "MultiPolygon"],
  ["208", "Denmark", "MultiPolygon"],
  ["826", "United Kingdom", "MultiPolygon"],
  ["352", "Iceland", "Polygon"],
  ["031", "Azerbaijan", "MultiPolygon"],
  ["268", "Georgia", "Polygon"],
  ["608", "Philippines", "MultiPolygon"],
  ["458", "Malaysia", "MultiPolygon"],
  ["096", "Brunei", "Polygon"],
  ["705", "Slovenia", "Polygon"],
  ["246", "Finland", "Polygon"],
  ["703", "Slovakia", "Polygon"],
  ["203", "Czechia", "Polygon"],
  ["232", "Eritrea", "Polygon"],
  ["392", "Japan", "MultiPolygon"],
  ["600", "Paraguay", "Polygon"],
  ["887", "Yemen", "Polygon"],
  ["682", "Saudi Arabia", "Polygon"],
  ["010", "Antarctica", "MultiPolygon"],
  ["196", "Cyprus", "Polygon"],
  ["504", "Morocco", "Polygon"],
  ["818", "Egypt", "Polygon"],
  ["434", "Libya", "Polygon"],
  ["231", "Ethiopia", "Polygon"],
  ["262", "Djibouti", "Polygon"],
  ["800", "Uganda", "Polygon"],
  ["646", "Rwanda", "Polygon"],
  ["070", "Bosnia and Herz.", "Polygon"],
  ["807", "Macedonia", "Polygon"],
  ["688", "Serbia", "Polygon"],
  ["499", "Montenegro", "Polygon"],
  ["780", "Trinidad and Tobago", "Polygon"],
  ["728", "S. Sudan", "Polygon"]
] as [string, string, string][];

const fs = new Fs(process.cwd());
const arrAggregator = Array.of<
  [
    string,
    {
      id: string;
      type: string;
      sourceCountryName: string;
      "iso-3166-1": Country;
    }
  ]
>();
const arrTuples =
  Array.of<[string, `${string}:${string}:${string}:${string}`]>();
(async () =>
  topojsonCountryData.forEach(function ([
    countryCode,
    countryName,
    geometryType
  ]) {
    const scaffold = {
      id: countryCode,
      type: geometryType,
      sourceCountryName: countryName,
      "iso-3166-1": whereNumeric(countryCode) as Country
    };
    arrTuples.push([
      countryCode,
      `${scaffold["iso-3166-1"].alpha2}:${scaffold["iso-3166-1"].alpha3}:${scaffold["iso-3166-1"].country}:${scaffold["iso-3166-1"].alpha2.toLowerCase()}.svg`
    ]);
    arrAggregator.push([countryCode, scaffold]);
  }))()
  .then(() => {
    fs.withWs(
      "src/utils/__generated__/tuple-topo-data-plus-flags.ts",
      `export const tupleTopoData = ${JSON.stringify(Object.fromEntries(arrTuples.sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))), null, 2)};`
    );
  })
  .catch(err => console.error(err));
