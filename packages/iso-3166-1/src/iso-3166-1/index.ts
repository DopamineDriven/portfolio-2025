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
    "383": "XK:XKX:Kosovo",
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

  public topoDataAndCountryAreaAndFlagAspectRatioByCountryCode = {
    "004": "AF:AFG:Afghanistan:652230:3/2",
    "008": "AL:ALB:Albania:28748:7/5",
    "010": "AQ:ATA:Antarctica:14200000:5/3",
    "012": "DZ:DZA:Algeria:2381741:3/2",
    "016": "AS:ASM:American Samoa:199:19/10",
    "020": "AD:AND:Andorra:468:10/7",
    "024": "AO:AGO:Angola:1246700:3/2",
    "028": "AG:ATG:Antigua and Barbuda:442:3/2",
    "032": "AR:ARG:Argentina:2780400:8/5",
    "051": "AM:ARM:Armenia:29743:2/1",
    "036": "AU:AUS:Australia:7692024:2/1",
    "040": "AT:AUT:Austria:83871:3/2",
    "031": "AZ:AZE:Azerbaijan:86600:2/1",
    "044": "BS:BHS:Bahamas:13943:2/1",
    "048": "BH:BHR:Bahrain:765:5/3",
    "050": "BD:BGD:Bangladesh:143998:5/3",
    "052": "BB:BRB:Barbados:430:3/2",
    "056": "BE:BEL:Belgium:30528:15/13",
    "084": "BZ:BLZ:Belize:22966:3/2",
    "060": "BM:BMU:Bermuda:54:2/1",
    "064": "BT:BTN:Bhutan:38394:3/2",
    "068": "BO:BOL:Bolivia:1098581:22/15",
    "070": "BA:BIH:Bosnia and Herzegovina:51197:2/1",
    "072": "BW:BWA:Botswana:582000:3/2",
    "074": "BV:BVT:Bouvet Island:49:11/8",
    "076": "BR:BRA:Brazil:8514877:10/7",
    "086": "IO:IOT:British Indian Ocean Territory:60:2/1",
    "092": "VG:VGB:British Virgin Islands:151:2/1",
    "096": "BN:BRN:Brunei Darussalam:5765:2/1",
    "090": "SB:SLB:Solomon Islands:28896:2/1",
    "100": "BG:BGR:Bulgaria:110879:5/3",
    "104": "MM:MMR:Myanmar:676578:11/6",
    "108": "BI:BDI:Burundi:27834:5/3",
    "112": "BY:BLR:Belarus:207600:2/1",
    "116": "KH:KHM:Cambodia:181035:3/2",
    "120": "CM:CMR:Cameroon:475442:3/2",
    "124": "CA:CAN:Canada:9984670:2/1",
    "132": "CV:CPV:Cabo Verde:4033:3/2",
    "136": "KY:CYM:Cayman Islands:264:2/1",
    "140": "CF:CAF:Central African Republic:622984:3/2",
    "144": "LK:LKA:Sri Lanka:65610:2/1",
    "148": "TD:TCD:Chad:1284000:3/2",
    "152": "CL:CHL:Chile:756102:3/2",
    "156": "CN:CHN:China:9596961:3/2",
    "158": "TW:TWN:Taiwan:36193:3/2",
    "162": "CX:CXR:Christmas Island:135:2/1",
    "166": "CC:CCK:Cocos Islands:14:2/1",
    "170": "CO:COL:Colombia:1141748:3/2",
    "174": "KM:COM:Comoros:1862:5/3",
    "175": "YT:MYT:Mayotte:374:3/2",
    "178": "CG:COG:Congo Republic:342000:3/2",
    "180": "CD:COD:Democratic Republic of the Congo:2344858:4/3",
    "184": "CK:COK:Cook Islands:236:2/1",
    "188": "CR:CRI:Costa Rica:51100:5/3",
    "191": "HR:HRV:Croatia:56594:2/1",
    "192": "CU:CUB:Cuba:109886:2/1",
    "196": "CY:CYP:Cyprus:9251:5/3",
    "203": "CZ:CZE:Czechia:78865:3/2",
    "204": "BJ:BEN:Benin:112622:3/2",
    "208": "DK:DNK:Denmark:43094:37/28",
    "212": "DM:DMA:Dominica:751:2/1",
    "214": "DO:DOM:Dominican Republic:48671:3/2",
    "218": "EC:ECU:Ecuador:256369:3/2",
    "222": "SV:SLV:El Salvador:21041:335/189",
    "226": "GQ:GNQ:Equatorial Guinea:28051:3/2",
    "231": "ET:ETH:Ethiopia:1104300:2/1",
    "232": "ER:ERI:Eritrea:117600:2/1",
    "233": "EE:EST:Estonia:45227:11/7",
    "234": "FO:FRO:Faroe Islands:1393:11/8",
    "238": "FK:FLK:Falkland Islands:12173:2/1",
    "239": "GS:SGS:South Georgia and the South Sandwich Islands:3903:2/1",
    "242": "FJ:FJI:Fiji:18272:2/1",
    "246": "FI:FIN:Finland:338424:18/11",
    "248": "AX:ALA:Åland Islands:1533:26/17",
    "250": "FR:FRA:France:551500:3/2",
    "254": "GF:GUF:French Guiana:83534:3/2",
    "258": "PF:PYF:French Polynesia:4000:3/2",
    "260": "TF:ATF:French Southern Territories:7747:3/2",
    "262": "DJ:DJI:Djibouti:23200:3/2",
    "266": "GA:GAB:Gabon:267668:4/3",
    "268": "GE:GEO:Georgia:69700:3/2",
    "270": "GM:GMB:Gambia:11295:3/2",
    "275": "PS:PSE:State of Palestine:6220:2/1",
    "276": "DE:DEU:Germany:357114:5/3",
    "288": "GH:GHA:Ghana:238533:3/2",
    "292": "GI:GIB:Gibraltar:6:2/1",
    "296": "KI:KIR:Kiribati:811:2/1",
    "300": "GR:GRC:Greece:131957:3/2",
    "304": "GL:GRL:Greenland:2166086:3/2",
    "308": "GD:GRD:Grenada:344:5/3",
    "312": "GP:GLP:Guadeloupe:1630:3/2",
    "316": "GU:GUM:Guam:549:41/22",
    "320": "GT:GTM:Guatemala:108889:8/5",
    "324": "GN:GIN:Guinea:245857:3/2",
    "328": "GY:GUY:Guyana:214969:5/3",
    "332": "HT:HTI:Haiti:27750:5/3",
    "334": "HM:HMD:Heard Island and McDonald Islands:412:2/1",
    "336": "VA:VAT:Holy See:0.44:1/1",
    "340": "HN:HND:Honduras:112492:2/1",
    "344": "HK:HKG:Hong Kong:1104:3/2",
    "348": "HU:HUN:Hungary:93028:3/2",
    "352": "IS:ISL:Iceland:103000:25/18",
    "356": "IN:IND:India:3166414:3/2",
    "360": "ID:IDN:Indonesia:1910931:3/2",
    "364": "IR:IRN:Islamic Republic of Iran:1648195:7/4",
    "368": "IQ:IRQ:Iraq:438317:3/2",
    "372": "IE:IRL:Ireland:70273:2/1",
    "376": "IL:ISR:Israel:20770:11/8",
    "380": "IT:ITA:Italy:301336:3/2",
    "383": "XK:XKX:Kosovo:10887:3/2",
    "384": "CI:CIV:Côte d'Ivoire:322463:3/2",
    "388": "JM:JAM:Jamaica:10991:2/1",
    "392": "JP:JPN:Japan:377930:3/2",
    "398": "KZ:KAZ:Kazakhstan:2724900:2/1",
    "400": "JO:JOR:Jordan:89342:2/1",
    "404": "KE:KEN:Kenya:580367:3/2",
    "408": "KP:PRK:Democratic People's Republic of Korea:120538:2/1",
    "410": "KR:KOR:Republic of Korea:99828:3/2",
    "414": "KW:KWT:Kuwait:17818:2/1",
    "417": "KG:KGZ:Kyrgyzstan:199951:5/3",
    "418": "LA:LAO:Lao People's Democratic Republic:236800:3/2",
    "422": "LB:LBN:Lebanon:10452:3/2",
    "426": "LS:LSO:Lesotho:30355:3/2",
    "428": "LV:LVA:Latvia:64559:2/1",
    "430": "LR:LBR:Liberia:111369:19/10",
    "434": "LY:LBY:Libya:1759540:2/1",
    "438": "LI:LIE:Liechtenstein:160:5/3",
    "440": "LT:LTU:Lithuania:65300:5/3",
    "442": "LU:LUX:Luxembourg:2586:5/3",
    "446": "MO:MAC:Macao:30:3/2",
    "450": "MG:MDG:Madagascar:587041:3/2",
    "454": "MW:MWI:Malawi:118484:3/2",
    "458": "MY:MYS:Malaysia:330803:2/1",
    "462": "MV:MDV:Maldives:300:3/2",
    "466": "ML:MLI:Mali:1240192:3/2",
    "470": "MT:MLT:Malta:316:3/2",
    "474": "MQ:MTQ:Martinique:1128:3/2",
    "478": "MR:MRT:Mauritania:1025520:3/2",
    "480": "MU:MUS:Mauritius:2040:3/2",
    "484": "MX:MEX:Mexico:1964375:7/4",
    "492": "MC:MCO:Monaco:2:5/4",
    "496": "MN:MNG:Mongolia:1564110:3/2",
    "498": "MD:MDA:Republic of Moldova:33846:2/1",
    "499": "ME:MNE:Montenegro:13812:2/1",
    "500": "MS:MSR:Montserrat:102:2/1",
    "504": "MA:MAR:Morocco:446550:3/2",
    "508": "MZ:MOZ:Mozambique:801590:3/2",
    "512": "OM:OMN:Oman:309500:2/1",
    "516": "NA:NAM:Namibia:824268:3/2",
    "520": "NR:NRU:Nauru:21:2/1",
    "524": "NP:NPL:Nepal:147181:1.21901033/1",
    "528": "NL:NLD:Netherlands:41528:3/2",
    "531": "CW:CUW:Curaçao:444:3/2",
    "533": "AW:ABW:Aruba:180:3/2",
    "534": "SX:SXM:Sint Maarten:34:3/2",
    "535": "BQ:BES:Bonaire, Sint Eustatius and Saba:322:3/2",
    "540": "NC:NCL:New Caledonia:18575:3/2",
    "548": "VU:VUT:Vanuatu:12189:36/19",
    "554": "NZ:NZL:New Zealand:270467:2/1",
    "558": "NI:NIC:Nicaragua:130373:5/3",
    "562": "NE:NER:Niger:1267000:7/6",
    "566": "NG:NGA:Nigeria:923768:2/1",
    "570": "NU:NIU:Niue:260:2/1",
    "574": "NF:NFK:Norfolk Island:36:2/1",
    "578": "NO:NOR:Norway:323802:11/8",
    "580": "MP:MNP:Northern Mariana Islands:464:2/1",
    "581": "UM:UMI:United States Minor Outlying Islands:34.2:19/10",
    "583": "FM:FSM:Micronesia:702:19/10",
    "584": "MH:MHL:Marshall Islands:181:19/10",
    "585": "PW:PLW:Palau:459:8/5",
    "586": "PK:PAK:Pakistan:796095:3/2",
    "591": "PA:PAN:Panama:75417:3/2",
    "598": "PG:PNG:Papua New Guinea:462840:4/3",
    "600": "PY:PRY:Paraguay:406752:20/11",
    "604": "PE:PER:Peru:1285216:3/2",
    "608": "PH:PHL:Philippines:300000:2/1",
    "612": "PN:PCN:Pitcairn:47:2/1",
    "616": "PL:POL:Poland:312685:8/5",
    "620": "PT:PRT:Portugal:92090:3/2",
    "624": "GW:GNB:Guinea-Bissau:36125:2/1",
    "626": "TL:TLS:Timor-Leste:14874:2/1",
    "630": "PR:PRI:Puerto Rico:8870:3/2",
    "634": "QA:QAT:Qatar:11586:28/11",
    "638": "RE:REU:Réunion:2513:3/2",
    "642": "RO:ROU:Romania:238391:3/2",
    "643": "RU:RUS:Russian Federation:17098242:3/2",
    "646": "RW:RWA:Rwanda:26338:3/2",
    "652": "BL:BLM:Saint Barthélemy:21:3/2",
    "654": "SH:SHN:Saint Helena, Ascension, and Tristan da Cunha:0:2/1",
    "659": "KN:KNA:Saint Kitts and Nevis:261:3/2",
    "660": "AI:AIA:Anguilla:91:2/1",
    "662": "LC:LCA:Saint Lucia:616:2/1",
    "663": "MF:MAF:Saint Martin:54:3/2",
    "666": "PM:SPM:Saint Pierre and Miquelon:242:3/2",
    "670": "VC:VCT:Saint Vincent and the Grenadines:389:3/2",
    "674": "SM:SMR:San Marino:61:4/3",
    "678": "ST:STP:Sao Tome and Principe:964:2/1",
    "682": "SA:SAU:Saudi Arabia:2149690:3/2",
    "686": "SN:SEN:Senegal:196722:3/2",
    "688": "RS:SRB:Serbia:88361:3/2",
    "690": "SC:SYC:Seychelles:452:2/1",
    "694": "SL:SLE:Sierra Leone:71740:3/2",
    "702": "SG:SGP:Singapore:710:3/2",
    "703": "SK:SVK:Slovakia:49037:3/2",
    "704": "VN:VNM:Viet Nam:331212:3/2",
    "705": "SI:SVN:Slovenia:20273:2/1",
    "706": "SO:SOM:Somalia:637657:3/2",
    "710": "ZA:ZAF:South Africa:1221037:3/2",
    "716": "ZW:ZWE:Zimbabwe:390757:2/1",
    "724": "ES:ESP:Spain:505992:3/2",
    "728": "SS:SSD:South Sudan:644329:2/1",
    "729": "SD:SDN:Sudan:1861484:2/1",
    "732": "EH:ESH:Western Sahara:266000:2/1",
    "740": "SR:SUR:Suriname:163820:3/2",
    "744": "SJ:SJM:Svalbard and Jan Mayen:62045:11/8",
    "748": "SZ:SWZ:Eswatini:17364:3/2",
    "752": "SE:SWE:Sweden:450295:8/5",
    "756": "CH:CHE:Switzerland:41284:1/1",
    "760": "SY:SYR:Syrian Arab Republic:185180:3/2",
    "762": "TJ:TJK:Tajikistan:143100:3/2",
    "764": "TH:THA:Thailand:513120:3/2",
    "768": "TG:TGO:Togo:56785:1.618/1",
    "772": "TK:TKL:Tokelau:12:2/1",
    "776": "TO:TON:Tonga:747:2/1",
    "780": "TT:TTO:Trinidad and Tobago:5130:5/3",
    "784": "AE:ARE:United Arab Emirates:83600:2/1",
    "788": "TN:TUN:Tunisia:163610:3/2",
    "792": "TR:TUR:Türkiye:783562:3/2",
    "795": "TM:TKM:Turkmenistan:488100:3/2",
    "796": "TC:TCA:Turks and Caicos Islands:948:2/1",
    "798": "TV:TUV:Tuvalu:26:2/1",
    "800": "UG:UGA:Uganda:241550:3/2",
    "804": "UA:UKR:Ukraine:603500:3/2",
    "807": "MK:MKD:North Macedonia:25713:2/1",
    "818": "EG:EGY:Egypt:1002000:3/2",
    "826": "GB:GBR:United Kingdom:242900:2/1",
    "831": "GG:GGY:Guernsey:78:5/3",
    "832": "JE:JEY:Jersey:116:5/3",
    "833": "IM:IMN:Isle of Man:572:2/1",
    "834": "TZ:TZA:United Republic of Tanzania:945087:3/2",
    "840": "US:USA:United States of America:9526468:19/10",
    "850": "VI:VIR:the Virgin Islands of the United States:347:3/2",
    "854": "BF:BFA:Burkina Faso:272967:3/2",
    "858": "UY:URY:Uruguay:181034:3/2",
    "860": "UZ:UZB:Uzbekistan:447400:2/1",
    "862": "VE:VEN:Venezuela (Bolivarian Republic of):912050:3/2",
    "876": "WF:WLF:Wallis and Futuna:142:3/2",
    "882": "WS:WSM:Samoa:2842:2/1",
    "887": "YE:YEM:Yemen:527968:3/2",
    "894": "ZM:ZMB:Zambia:752612:3/2"
  } as const;

  // prettier-ignore
  public flagAspectRatioArr = ["3/2" , "7/5" , "5/3" , "19/10" , "10/7" , "8/5" , "2/1" , "15/13" , "22/15" , "11/8" , "11/6" , "4/3" , "37/28" , "335/189" , "11/7" , "18/11" , "26/17" , "41/22" , "1/1" , "25/18" , "7/4" , "5/4" , "1.21901033/1" , "36/19" , "7/6" , "20/11" , "28/11" , "1.618/1"] as const;

  // prettier-ignore
  public alpha2Arr = ["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"] as const;

  // prettier-ignore
  public alpha3Arr = ["ABW", "AFG", "AGO", "AIA", "ALA", "ALB", "AND", "ARE", "ARG", "ARM", "ASM", "ATA", "ATF", "ATG", "AUS", "AUT", "AZE", "BDI", "BEL", "BEN", "BES", "BFA", "BGD", "BGR", "BHR", "BHS", "BIH", "BLM", "BLR", "BLZ", "BMU", "BOL", "BRA", "BRB", "BRN", "BTN", "BVT", "BWA", "CAF", "CAN", "CCK", "CHE", "CHL", "CHN", "CIV", "CMR", "COD", "COG", "COK", "COL", "COM", "CPV", "CRI", "CUB", "CUW", "CXR", "CYM", "CYP", "CZE", "DEU", "DJI", "DMA", "DNK", "DOM", "DZA", "ECU", "EGY", "ERI", "ESH", "ESP", "EST", "ETH", "FIN", "FJI", "FLK", "FRA", "FRO", "FSM", "GAB", "GBR", "GEO", "GGY", "GHA", "GIB", "GIN", "GLP", "GMB", "GNB", "GNQ", "GRC", "GRD", "GRL", "GTM", "GUF", "GUM", "GUY", "HKG", "HMD", "HND", "HRV", "HTI", "HUN", "IDN", "IMN", "IND", "IOT", "IRL", "IRN", "IRQ", "ISL", "ISR", "ITA", "JAM", "JEY", "JOR", "JPN", "KAZ", "KEN", "KGZ", "KHM", "KIR", "KNA", "KOR", "KWT", "LAO", "LBN", "LBR", "LBY", "LCA", "LIE", "LKA", "LSO", "LTU", "LUX", "LVA", "MAC", "MAF", "MAR", "MCO", "MDA", "MDG", "MDV", "MEX", "MHL", "MKD", "MLI", "MLT", "MMR", "MNE", "MNG", "MNP", "MOZ", "MRT", "MSR", "MTQ", "MUS", "MWI", "MYS", "MYT", "NAM", "NCL", "NER", "NFK", "NGA", "NIC", "NIU", "NLD", "NOR", "NPL", "NRU", "NZL", "OMN", "PAK", "PAN", "PCN", "PER", "PHL", "PLW", "PNG", "POL", "PRI", "PRK", "PRT", "PRY", "PSE", "PYF", "QAT", "REU", "ROU", "RUS", "RWA", "SAU", "SDN", "SEN", "SGP", "SGS", "SHN", "SJM", "SLB", "SLE", "SLV", "SMR", "SOM", "SPM", "SRB", "SSD", "STP", "SUR", "SVK", "SVN", "SWE", "SWZ", "SXM", "SYC", "SYR", "TCA", "TCD", "TGO", "THA", "TJK", "TKL", "TKM", "TLS", "TON", "TTO", "TUN", "TUR", "TUV", "TWN", "TZA", "UGA", "UKR", "UMI", "URY", "USA", "UZB", "VAT", "VCT", "VEN", "VGB", "VIR", "VNM", "VUT", "WLF", "WSM", "XKX", "YEM", "ZAF", "ZMB", "ZWE"] as const;

  // prettier-ignore
  public countryCodeArr = ["004", "008", "010", "012", "016", "020", "024", "028", "031", "032", "036", "040", "044", "048", "050", "051", "052", "056", "060", "064", "068", "070", "072", "074", "076", "084", "086", "090", "092", "096", "100", "104", "108", "112", "116", "120", "124", "132", "136", "140", "144", "148", "152", "156", "158", "162", "166", "170", "174", "175", "178", "180", "184", "188", "191", "192", "196", "203", "204", "208", "212", "214", "218", "222", "226", "231", "232", "233", "234", "238", "239", "242", "246", "248", "250", "254", "258", "260", "262", "266", "268", "270", "275", "276", "288", "292", "296", "300", "304", "308", "312", "316", "320", "324", "328", "332", "334", "336", "340", "344", "348", "352", "356", "360", "364", "368", "372", "376", "380", "383", "384", "388", "392", "398", "400", "404", "408", "410", "414", "417", "418", "422", "426", "428", "430", "434", "438", "440", "442", "446", "450", "454", "458", "462", "466", "470", "474", "478", "480", "484", "492", "496", "498", "499", "500", "504", "508", "512", "516", "520", "524", "528", "531", "533", "534", "535", "540", "548", "554", "558", "562", "566", "570", "574", "578", "580", "581", "583", "584", "585", "586", "591", "598", "600", "604", "608", "612", "616", "620", "624", "626", "630", "634", "638", "642", "643", "646", "652", "654", "659", "660", "662", "663", "666", "670", "674", "678", "682", "686", "688", "690", "694", "702", "703", "704", "705", "706", "710", "716", "724", "728", "729", "732", "740", "744", "748", "752", "756", "760", "762", "764", "768", "772", "776", "780", "784", "788", "792", "795", "796", "798", "800", "804", "807", "818", "826", "831", "832", "833", "834", "840", "850", "854", "858", "860", "862", "876", "882", "887", "894"] as const;

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

  public parseExtendedCountryData<const V extends string>(target: V) {
    if (/[0-9]{3,3}/g.test(`${target}`) === true) {
      return this.parseCountryDataByCode(
        this.topoDataAndCountryAreaAndFlagAspectRatioByCountryCode[
          target as keyof typeof this.topoDataAndCountryAreaAndFlagAspectRatioByCountryCode
        ]
      );
    } else throw new Error(`invalid country code ${target}`);
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

  public getCountrySurfaceArea<const V extends string>(target: V) {
    return this.parseExtendedCountryData(target)[3];
  }

  public getCountryFlagAspectRatio<const V extends string>(target: V) {
    return this.parseExtendedCountryData(target)[4];
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

  public parseCountryDataCountryFlagAndCountryArea<const V extends string>(
    target: V
  ) {
    return [
      ...this.parseCountryData(target),
      this.getCountryFlag(target),
      this.getCountrySurfaceArea(target) as string,
      this.getCountryFlagAspectRatio(target) as string
    ] as const;
  }

  public countryCodeToObjOutput<const V extends string>(target: V) {
    if (target === "001") {
      const flagUrl =
        "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/en.svg";
      const quasiAlpha2 = "EN";
      const quasiAlpha3 = "EAR";
      const quasiCountryName = "Earth";
      const quasiCountryCode = "001";
      const surfaceAreaOfLandOnEarth = "148000000";
      const flagAspectRatio = "3/2";
      return {
        alpha2: quasiAlpha2,
        alpha3: quasiAlpha3,
        countryCode: quasiCountryCode,
        countryName: quasiCountryName,
        countryFlag: flagUrl,
        surfaceArea: surfaceAreaOfLandOnEarth,
        flagAspectRatio: flagAspectRatio
      };
    } else {
      const [
        alpha2,
        alpha3,
        countryName,
        countryFlag,
        surfaceArea,
        flagAspectRatio
      ] = this.parseCountryDataCountryFlagAndCountryArea(target);
      return {
        alpha2,
        alpha3,
        countryCode: target,
        countryName,
        countryFlag,
        surfaceArea,
        flagAspectRatio
      };
    }
  }
}
