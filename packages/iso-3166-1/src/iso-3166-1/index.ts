import type { InferExciseColonOutput } from "@/types/index.ts";

export default class Iso3166_1 {
  public topoDataByCountryCode = {
    "004": "AF:AFG:Afghanistan",
    "008": "AL:ALB:Albania",
    "010": "AQ:ATA:Antarctica",
    "012": "DZ:DZA:Algeria",
    "016": "AS:ASM:American Samoa",
    "020": "AD:AND:Andorra",
    "024": "AO:AGO:Angola",
    "028": "AG:ATG:Antigua and Barbuda",
    "031": "AZ:AZE:Azerbaijan",
    "032": "AR:ARG:Argentina",
    "036": "AU:AUS:Australia",
    "040": "AT:AUT:Austria",
    "044": "BS:BHS:Bahamas",
    "048": "BH:BHR:Bahrain",
    "050": "BD:BGD:Bangladesh",
    "051": "AM:ARM:Armenia",
    "052": "BB:BRB:Barbados",
    "056": "BE:BEL:Belgium",
    "060": "BM:BMU:Bermuda",
    "064": "BT:BTN:Bhutan",
    "068": "BO:BOL:Bolivia",
    "070": "BA:BIH:Bosnia and Herzegovina",
    "072": "BW:BWA:Botswana",
    "074": "BV:BVT:Bouvet Island",
    "076": "BR:BRA:Brazil",
    "084": "BZ:BLZ:Belize",
    "086": "IO:IOT:British Indian Ocean Territory",
    "090": "SB:SLB:Solomon Islands",
    "092": "VG:VGB:British Virgin Islands",
    "096": "BN:BRN:Brunei Darussalam",
    "100": "BG:BGR:Bulgaria",
    "104": "MM:MMR:Myanmar",
    "108": "BI:BDI:Burundi",
    "112": "BY:BLR:Belarus",
    "116": "KH:KHM:Cambodia",
    "120": "CM:CMR:Cameroon",
    "124": "CA:CAN:Canada",
    "132": "CV:CPV:Cabo Verde",
    "136": "KY:CYM:Cayman Islands",
    "140": "CF:CAF:Central African Republic",
    "144": "LK:LKA:Sri Lanka",
    "148": "TD:TCD:Chad",
    "152": "CL:CHL:Chile",
    "156": "CN:CHN:China",
    "158": "TW:TWN:Taiwan",
    "162": "CX:CXR:Christmas Island",
    "166": "CC:CCK:Cocos Islands",
    "170": "CO:COL:Colombia",
    "174": "KM:COM:Comoros",
    "175": "YT:MYT:Mayotte",
    "178": "CG:COG:Congo Republic",
    "180": "CD:COD:Democratic Republic of the Congo",
    "184": "CK:COK:Cook Islands",
    "188": "CR:CRI:Costa Rica",
    "191": "HR:HRV:Croatia",
    "192": "CU:CUB:Cuba",
    "196": "CY:CYP:Cyprus",
    "203": "CZ:CZE:Czechia",
    "204": "BJ:BEN:Benin",
    "208": "DK:DNK:Denmark",
    "212": "DM:DMA:Dominica",
    "214": "DO:DOM:Dominican Republic",
    "218": "EC:ECU:Ecuador",
    "222": "SV:SLV:El Salvador",
    "226": "GQ:GNQ:Equatorial Guinea",
    "231": "ET:ETH:Ethiopia",
    "232": "ER:ERI:Eritrea",
    "233": "EE:EST:Estonia",
    "234": "FO:FRO:Faroe Islands",
    "238": "FK:FLK:Falkland Islands",
    "239": "GS:SGS:South Georgia and the South Sandwich Islands",
    "242": "FJ:FJI:Fiji",
    "246": "FI:FIN:Finland",
    "248": "AX:ALA:Åland Islands",
    "250": "FR:FRA:France",
    "254": "GF:GUF:French Guiana",
    "258": "PF:PYF:French Polynesia",
    "260": "TF:ATF:French Southern Territories",
    "262": "DJ:DJI:Djibouti",
    "266": "GA:GAB:Gabon",
    "268": "GE:GEO:Georgia",
    "270": "GM:GMB:Gambia",
    "275": "PS:PSE:State of Palestine",
    "276": "DE:DEU:Germany",
    "288": "GH:GHA:Ghana",
    "292": "GI:GIB:Gibraltar",
    "296": "KI:KIR:Kiribati",
    "300": "GR:GRC:Greece",
    "304": "GL:GRL:Greenland",
    "308": "GD:GRD:Grenada",
    "312": "GP:GLP:Guadeloupe",
    "316": "GU:GUM:Guam",
    "320": "GT:GTM:Guatemala",
    "324": "GN:GIN:Guinea",
    "328": "GY:GUY:Guyana",
    "332": "HT:HTI:Haiti",
    "334": "HM:HMD:Heard Island and McDonald Islands",
    "336": "VA:VAT:Holy See",
    "340": "HN:HND:Honduras",
    "344": "HK:HKG:Hong Kong",
    "348": "HU:HUN:Hungary",
    "352": "IS:ISL:Iceland",
    "356": "IN:IND:India",
    "360": "ID:IDN:Indonesia",
    "364": "IR:IRN:Islamic Republic of Iran",
    "368": "IQ:IRQ:Iraq",
    "372": "IE:IRL:Ireland",
    "376": "IL:ISR:Israel",
    "380": "IT:ITA:Italy",
    "384": "CI:CIV:Côte d'Ivoire",
    "388": "JM:JAM:Jamaica",
    "392": "JP:JPN:Japan",
    "398": "KZ:KAZ:Kazakhstan",
    "400": "JO:JOR:Jordan",
    "404": "KE:KEN:Kenya",
    "408": "KP:PRK:Democratic People's Republic of Korea",
    "410": "KR:KOR:Republic of Korea",
    "414": "KW:KWT:Kuwait",
    "417": "KG:KGZ:Kyrgyzstan",
    "418": "LA:LAO:Lao People's Democratic Republic",
    "422": "LB:LBN:Lebanon",
    "426": "LS:LSO:Lesotho",
    "428": "LV:LVA:Latvia",
    "430": "LR:LBR:Liberia",
    "434": "LY:LBY:Libya",
    "438": "LI:LIE:Liechtenstein",
    "440": "LT:LTU:Lithuania",
    "442": "LU:LUX:Luxembourg",
    "446": "MO:MAC:Macao",
    "450": "MG:MDG:Madagascar",
    "454": "MW:MWI:Malawi",
    "458": "MY:MYS:Malaysia",
    "462": "MV:MDV:Maldives",
    "466": "ML:MLI:Mali",
    "470": "MT:MLT:Malta",
    "474": "MQ:MTQ:Martinique",
    "478": "MR:MRT:Mauritania",
    "480": "MU:MUS:Mauritius",
    "484": "MX:MEX:Mexico",
    "492": "MC:MCO:Monaco",
    "496": "MN:MNG:Mongolia",
    "498": "MD:MDA:Republic of Moldova",
    "499": "ME:MNE:Montenegro",
    "500": "MS:MSR:Montserrat",
    "504": "MA:MAR:Morocco",
    "508": "MZ:MOZ:Mozambique",
    "512": "OM:OMN:Oman",
    "516": "NA:NAM:Namibia",
    "520": "NR:NRU:Nauru",
    "524": "NP:NPL:Nepal",
    "528": "NL:NLD:Netherlands",
    "531": "CW:CUW:Curaçao",
    "533": "AW:ABW:Aruba",
    "534": "SX:SXM:Sint Maarten",
    "535": "BQ:BES:Bonaire, Sint Eustatius, and Saba",
    "540": "NC:NCL:New Caledonia",
    "548": "VU:VUT:Vanuatu",
    "554": "NZ:NZL:New Zealand",
    "558": "NI:NIC:Nicaragua",
    "562": "NE:NER:Niger",
    "566": "NG:NGA:Nigeria",
    "570": "NU:NIU:Niue",
    "574": "NF:NFK:Norfolk Island",
    "578": "NO:NOR:Norway",
    "580": "MP:MNP:Northern Mariana Islands",
    "581": "UM:UMI:United States Minor Outlying Islands",
    "583": "FM:FSM:Micronesia",
    "584": "MH:MHL:Marshall Islands",
    "585": "PW:PLW:Palau",
    "586": "PK:PAK:Pakistan",
    "591": "PA:PAN:Panama",
    "598": "PG:PNG:Papua New Guinea",
    "600": "PY:PRY:Paraguay",
    "604": "PE:PER:Peru",
    "608": "PH:PHL:Philippines",
    "612": "PN:PCN:Pitcairn",
    "616": "PL:POL:Poland",
    "620": "PT:PRT:Portugal",
    "624": "GW:GNB:Guinea-Bissau",
    "626": "TL:TLS:Timor-Leste",
    "630": "PR:PRI:Puerto Rico",
    "634": "QA:QAT:Qatar",
    "638": "RE:REU:Réunion",
    "642": "RO:ROU:Romania",
    "643": "RU:RUS:Russian Federation",
    "646": "RW:RWA:Rwanda",
    "652": "BL:BLM:Saint Barthélemy",
    "654": "SH:SHN:Saint Helena, Ascension, and Tristan da Cunha",
    "659": "KN:KNA:Saint Kitts and Nevis",
    "660": "AI:AIA:Anguilla",
    "662": "LC:LCA:Saint Lucia",
    "663": "MF:MAF:Saint Martin",
    "666": "PM:SPM:Saint Pierre and Miquelon",
    "670": "VC:VCT:Saint Vincent and the Grenadines",
    "674": "SM:SMR:San Marino",
    "678": "ST:STP:Sao Tome and Principe",
    "682": "SA:SAU:Saudi Arabia",
    "686": "SN:SEN:Senegal",
    "688": "RS:SRB:Serbia",
    "690": "SC:SYC:Seychelles",
    "694": "SL:SLE:Sierra Leone",
    "702": "SG:SGP:Singapore",
    "703": "SK:SVK:Slovakia",
    "704": "VN:VNM:Viet Nam",
    "705": "SI:SVN:Slovenia",
    "706": "SO:SOM:Somalia",
    "710": "ZA:ZAF:South Africa",
    "716": "ZW:ZWE:Zimbabwe",
    "724": "ES:ESP:Spain",
    "728": "SS:SSD:South Sudan",
    "729": "SD:SDN:Sudan",
    "732": "EH:ESH:Western Sahara",
    "740": "SR:SUR:Suriname",
    "744": "SJ:SJM:Svalbard and Jan Mayen",
    "748": "SZ:SWZ:Eswatini",
    "752": "SE:SWE:Sweden",
    "756": "CH:CHE:Switzerland",
    "760": "SY:SYR:Syrian Arab Republic",
    "762": "TJ:TJK:Tajikistan",
    "764": "TH:THA:Thailand",
    "768": "TG:TGO:Togo",
    "772": "TK:TKL:Tokelau",
    "776": "TO:TON:Tonga",
    "780": "TT:TTO:Trinidad and Tobago",
    "784": "AE:ARE:United Arab Emirates",
    "788": "TN:TUN:Tunisia",
    "792": "TR:TUR:Türkiye",
    "795": "TM:TKM:Turkmenistan",
    "796": "TC:TCA:Turks and Caicos Islands",
    "798": "TV:TUV:Tuvalu",
    "800": "UG:UGA:Uganda",
    "804": "UA:UKR:Ukraine",
    "807": "MK:MKD:North Macedonia",
    "818": "EG:EGY:Egypt",
    "826": "GB:GBR:United Kingdom of Great Britain and Northern Ireland",
    "831": "GG:GGY:Guernsey",
    "832": "JE:JEY:Jersey",
    "833": "IM:IMN:Isle of Man",
    "834": "TZ:TZA:United Republic of Tanzania",
    "840": "US:USA:United States of America",
    "850": "VI:VIR:the Virgin Islands of the United States",
    "854": "BF:BFA:Burkina Faso",
    "858": "UY:URY:Uruguay",
    "860": "UZ:UZB:Uzbekistan",
    "862": "VE:VEN:Venezuela (Bolivarian Republic of)",
    "876": "WF:WLF:Wallis and Futuna",
    "882": "WS:WSM:Samoa",
    "887": "YE:YEM:Yemen",
    "894": "ZM:ZMB:Zambia"
  } as const;

  // prettier-ignore
  public alpha2Arr = ["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"] as const;

  // prettier-ignore
  public alpha3Arr = ["ABW", "AFG", "AGO", "AIA", "ALA", "ALB", "AND", "ARE", "ARG", "ARM", "ASM", "ATA", "ATF", "ATG", "AUS", "AUT", "AZE", "BDI", "BEL", "BEN", "BES", "BFA", "BGD", "BGR", "BHR", "BHS", "BIH", "BLM", "BLR", "BLZ", "BMU", "BOL", "BRA", "BRB", "BRN", "BTN", "BVT", "BWA", "CAF", "CAN", "CCK", "CHE", "CHL", "CHN", "CIV", "CMR", "COD", "COG", "COK", "COL", "COM", "CPV", "CRI", "CUB", "CUW", "CXR", "CYM", "CYP", "CZE", "DEU", "DJI", "DMA", "DNK", "DOM", "DZA", "ECU", "EGY", "ERI", "ESH", "ESP", "EST", "ETH", "FIN", "FJI", "FLK", "FRA", "FRO", "FSM", "GAB", "GBR", "GEO", "GGY", "GHA", "GIB", "GIN", "GLP", "GMB", "GNB", "GNQ", "GRC", "GRD", "GRL", "GTM", "GUF", "GUM", "GUY", "HKG", "HMD", "HND", "HRV", "HTI", "HUN", "IDN", "IMN", "IND", "IOT", "IRL", "IRN", "IRQ", "ISL", "ISR", "ITA", "JAM", "JEY", "JOR", "JPN", "KAZ", "KEN", "KGZ", "KHM", "KIR", "KNA", "KOR", "KWT", "LAO", "LBN", "LBR", "LBY", "LCA", "LIE", "LKA", "LSO", "LTU", "LUX", "LVA", "MAC", "MAF", "MAR", "MCO", "MDA", "MDG", "MDV", "MEX", "MHL", "MKD", "MLI", "MLT", "MMR", "MNE", "MNG", "MNP", "MOZ", "MRT", "MSR", "MTQ", "MUS", "MWI", "MYS", "MYT", "NAM", "NCL", "NER", "NFK", "NGA", "NIC", "NIU", "NLD", "NOR", "NPL", "NRU", "NZL", "OMN", "PAK", "PAN", "PCN", "PER", "PHL", "PLW", "PNG", "POL", "PRI", "PRK", "PRT", "PRY", "PSE", "PYF", "QAT", "REU", "ROU", "RUS", "RWA", "SAU", "SDN", "SEN", "SGP", "SGS", "SHN", "SJM", "SLB", "SLE", "SLV", "SMR", "SOM", "SPM", "SRB", "SSD", "STP", "SUR", "SVK", "SVN", "SWE", "SWZ", "SXM", "SYC", "SYR", "TCA", "TCD", "TGO", "THA", "TJK", "TKL", "TKM", "TLS", "TON", "TTO", "TUN", "TUR", "TUV", "TWN", "TZA", "UGA", "UKR", "UMI", "URY", "USA", "UZB", "VAT", "VCT", "VEN", "VGB", "VIR", "VNM", "VUT", "WLF", "WSM", "YEM", "ZAF", "ZMB", "ZWE"] as const;

  // prettier-ignore
  public countryCodeArr = ["004", "008", "010", "012", "016", "020", "024", "028", "031", "032", "036", "040", "044", "048", "050", "051", "052", "056", "060", "064", "068", "070", "072", "074", "076", "084", "086", "090", "092", "096", "100", "104", "108", "112", "116", "120", "124", "132", "136", "140", "144", "148", "152", "156", "158", "162", "166", "170", "174", "175", "178", "180", "184", "188", "191", "192", "196", "203", "204", "208", "212", "214", "218", "222", "226", "231", "232", "233", "234", "238", "239", "242", "246", "248", "250", "254", "258", "260", "262", "266", "268", "270", "275", "276", "288", "292", "296", "300", "304", "308", "312", "316", "320", "324", "328", "332", "334", "336", "340", "344", "348", "352", "356", "360", "364", "368", "372", "376", "380", "384", "388", "392", "398", "400", "404", "408", "410", "414", "417", "418", "422", "426", "428", "430", "434", "438", "440", "442", "446", "450", "454", "458", "462", "466", "470", "474", "478", "480", "484", "492", "496", "498", "499", "500", "504", "508", "512", "516", "520", "524", "528", "531", "533", "534", "535", "540", "548", "554", "558", "562", "566", "570", "574", "578", "580", "581", "583", "584", "585", "586", "591", "598", "600", "604", "608", "612", "616", "620", "624", "626", "630", "634", "638", "642", "643", "646", "652", "654", "659", "660", "662", "663", "666", "670", "674", "678", "682", "686", "688", "690", "694", "702", "703", "704", "705", "706", "710", "716", "724", "728", "729", "732", "740", "744", "748", "752", "756", "760", "762", "764", "768", "772", "776", "780", "784", "788", "792", "795", "796", "798", "800", "804", "807", "818", "826", "831", "832", "833", "834", "840", "850", "854", "858", "860", "862", "876", "882", "887", "894"] as const;

  constructor() {}

  public get alpha2Union() {
    return this.alpha2Arr.reduce(t => t);
  }

  public get alpha3Union() {
    return this.alpha3Arr.reduce(t => t);
  }

  public get countryCodeUnion() {
    return this.countryCodeArr.reduce(t => t);
  }

  public exciseColons<const T extends string>(
    str: T
  ): InferExciseColonOutput<T> {
    return str.split(/:/g) as InferExciseColonOutput<typeof str>;
  }

  public parseTargeted(input: string) {
    if (/\b[A-Z]{2,2}\b/gi.test(input) === true) {
      return this.getAlpha2(input);
    }
  }

  public parseCountryDataByCode = <const V extends string>(props: V) =>
    this.exciseColons(props);

  public parseCountryData<const V extends string>(target: V) {
    if (/[0-9]{3,3}/g.test(`${target}`) === true) {
      return this.parseCountryDataByCode(
        this.topoDataByCountryCode[
          target as keyof typeof this.topoDataByCountryCode
        ]
      );
    } else throw new Error(`invalid country code ${target}`);
  }

  public getAlpha2<const V extends string>(target: V) {
    return this.parseCountryData(target)[0];
  }

  public getAlpha3<const V extends string>(target: V) {
    return this.parseCountryData(target)[1];
  }

  public getCountryName<const V extends string>(target: V) {
    return this.parseCountryData(target)[2];
  }

  public getCountryFlag<const V extends string>(target: V) {
    // prettier-ignore
    return `https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/${this.parseCountryData(target)[0].toLowerCase()}.svg`
  }

  /**
   * The last index (position 3, the 4th index) returned contains a url to a flag svg image (image/svg+xml)
   */
  public parseCountryDataAndFlag<const V extends string>(target: V) {
    return [
      ...this.parseCountryData(target),
      this.getCountryFlag(target)
    ] as const;
  }
}
