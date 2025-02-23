### DERIVING TOTAL KM OF COUNTRIES IN SQ KM

```ts

const data = `1,Vatican City,3.2,0.44,7.2727273
2,Monaco,4.4,2,2.2000000
3,San Marino,39,61,0.6393443
4,Liechtenstein,76,160,0.4650000
5,Sint Maarten,10.2,34,0.3000000
6,Andorra,120.3,468,0.2570513
7,Gibraltar ,1.2,6,0.2000000
8,Saint Martin,10.2,54,0.1888889
9,Luxembourg,359,2586,0.1388244
10,Palestinian territories,466,6220,0.0749196
11,Brunei,381,5765,0.0660885
12,Slovenia,1334,20273,0.0658018
13,The Gambia,740,11295,0.0655157
14,Kosovo,701,10887,0.0643887
15,Israel,1017,20770,0.0489649
16,Belgium,1385,30528,0.0453682
17,Montenegro,625,13812,0.0452505
18,Switzerland,1852,41284,0.0448600
19,Lebanon,454,10452,0.0434367
20,Armenia,1254,29743,0.0421612
21,Moldova,1389,33846,0.0410388
22,Croatia,2197,56594,0.0388204
23,Burundi,974,27834,0.0349932
24,Rwanda,893,26338,0.0339054
25,Slovakia,1524,49037,0.0310786
26,Swaziland,535,17364,0.0308109
27,Austria,2562,83871,0.0305469
28,Lesotho,909,30355,0.0299456
29,Macedonia,766,25713,0.0297904
30,Bangladesh,4246,143998,0.0294865
31,Togo,1647,56785,0.0290041
32,Bosnia and Herzegovina,1459,51197,0.0284978
33,Bhutan,1075,38394,0.0279992
34,Hong Kong,30,1104,0.0271739
35,Kuwait,462,17818,0.0259288
36,El Salvador,545,21041,0.0259018
37,Tajikistan,3651,143100,0.0255136
38,Albania,720,28748,0.0250452
39,Netherlands,1027,41528,0.0247303
40,Malawi,2881,118484,0.0243155
41,Czech Republic,1881,78865,0.0238509
42,Hungary,2171,93028,0.0233371
43,Azerbaijan,2013,86600,0.0232448
44,Serbia,2027,88361,0.0229400
45,Belize,516,22966,0.0224680
46,Djibouti,516,23200,0.0222414
47,Laos,5083,236800,0.0214654
48,Georgia,1461,69700,0.0209613
49,Guinea-Bissau,724,36125,0.0200415
50,Nepal,2926,147181,0.0198803
51,Lithuania,1273,65300,0.0194946
52,Kyrgyzstan,3878,199951,0.0193948
53,Equatorial Guinea,539,28051,0.0192150
54,Jordan,1635,89342,0.0183005
55,Latvia,1150,64559,0.0178132
56,Benin,1989,112622,0.0176608
57,Cyprus,152,9251,0.0164307
58,Bulgaria,1808,110879,0.0163061
59,Republic of the Congo,5504,342000,0.0160936
60,Guatemala,1687,108889,0.0154928
61,East Timor,228,14874,0.0153288
62,Liberia,1585,111369,0.0142320
63,Cambodia,2572,181035,0.0142072
64,French Guiana,1183,83534,0.0141619
65,Vietnam,4639,331212,0.0140061
66,Estonia,633,45227,0.0139961
67,Belarus,2900,207600,0.0139692
68,Uzbekistan,6221,447400,0.0139048
69,North Korea,1673,120538,0.0138794
70,Eritrea,1626,117600,0.0138265
71,Guinea,3399,245857,0.0138251
72,Honduras,1520,112492,0.0135121
73,Senegal,2640,196722,0.0134200
74,Sierra Leone,958,71740,0.0133538
75,Portugal,1214,92090,0.0131828
76,Haiti,360,27750,0.0129730
77,Costa Rica,639,51100,0.0125049
78,Syria,2253,185180,0.0121665
79,Burkina Faso,3193,272967,0.0116974
80,Guyana,2462,214969,0.0114528
81,Macau,0.34,30,0.0113333
82,Uganda,2698,241550,0.0111695
83,Romania,2508,238391,0.0105205
84,Suriname,1707,163820,0.0104200
85,United Arab Emirates,867,83600,0.0103708
86,Germany,3621,357114,0.0101396
87,Cameroon,4591,475442,0.0096563
88,Côte d'Ivoire,3110,322463,0.0096445
89,Paraguay,3920,406752,0.0096373
90,Gabon,2551,267668,0.0095305
91,Malaysia,3147,330803,0.0095132
92,Thailand,4863,513120,0.0094773
93,Nicaragua,1231,130373,0.0094421
94,Greece,1228,131957,0.0093061
95,Poland,2788,312685,0.0089163
96,Ghana,2094,238533,0.0087787
97,Tunisia,1424,163610,0.0087036
98,Burma,5876,676578,0.0086849
99,Uruguay,1564,181034,0.0086393
100,Pakistan,6774,796095,0.0085090
101,Afghanistan,5529,652230,0.0084771
102,Central African Republic,5203,622984,0.0083517
103,Iraq,3650,438317,0.0083273
104,Chile,6171,756102,0.0081616
105,Finland,2690,338424,0.0079486
106,Norway,2551,323802,0.0078783
107,Zimbabwe,3066,390757,0.0078463
108,Ecuador,2010,256369,0.0078403
109,Ukraine,4663,603500,0.0077266
110,Turkmenistan,3736,488100,0.0076542
111,Zambia,5667,752612,0.0075298
112,South Sudan,4797,644329,0.0074450
113,Dominican Republic,360,48671,0.0073966
114,Panama,555,75417,0.0073591
115,Botswana,4015,582000,0.0068986
116,Italy,1932,301336,0.0064114
117,Bolivia,6743,1098581,0.0061379
118,Kenya,3477,580367,0.0059910
119,Mali,7243,1240192,0.0058402
120,Mozambique,4571,801590,0.0057024
121,Venezuela,4993,912050,0.0054745
122,Colombia,6004,1141748,0.0052586
123,Mongolia,8220,1564110,0.0052554
124,France,2889,551500,0.0052384
125,Qatar,60,11586,0.0051787
126,Ireland,360,70273,0.0051229
127,Sweden,2233,450295,0.0049590
128,Mauritania,5074,1025520,0.0049477
129,Ethiopia,5328,1104300,0.0048248
130,Namibia,3936,824268,0.0047751
131,Chad,5968,1284000,0.0046480
132,Democratic Republic of the Congo,10730,2344858,0.0045760
133,Morocco,2018,446550,0.0045191
134,Niger,5697,1267000,0.0044964
135,India,14103.1,3166414,0.0044540
136,Oman,1374,309500,0.0044394
137,Kazakhstan,12012,2724900,0.0044082
138,Nigeria,4047,923768,0.0043810
139,Peru,5536,1285216,0.0043074
140,Angola,5198,1246700,0.0041694
141,Tanzania,3861,945087,0.0040853
142,South Africa,4862,1221037,0.0039819
143,Spain,1918,505992,0.0037906
144,Somalia,2340,637657,0.0036697
145,Sudan,6764,1861484,0.0036337
146,Argentina,9665,2780400,0.0034761
147,Turkey,2648,783562,0.0033794
148,Yemen,1746,527968,0.0033070
149,Iran,5440,1648195,0.0033006
150,Algeria,6343,2381741,0.0026632
151,Egypt,2665,1002000,0.0026597
152,Libya,4348,1759540,0.0024711
153,South Korea,238,99828,0.0023841
154,People's Republic of China,22147,9596961,0.0023077
155,Mexico,4353,1964375,0.0022160
156,Saudi Arabia,4431,2149690,0.0020612
157,Papua New Guinea,820,462840,0.0017717
158,Brazil,14691,8514877,0.0017253
159,Denmark,68,43094,0.0015779
160,Western Sahara,404,266000,0.0015188
161,United Kingdom,360,242900,0.0014821
162,Indonesia,2830,1910931,0.0014810
163,United States,12034,9526468,0.0012632
164,Russia,20017,17098242,0.0011707
165,Canada,8893,9984670,0.0008907
166,Sri Lanka,0.1,65610,0.0000015
167,American Samoa,0,199,0
168,Anguilla ,0,91,0
169,Antigua and Barbuda,0,442,0
170,Aruba,0,180,0
171,Australia,0,7692024,0
172,Bahamas,0,13943,0
173,Bahrain,0,765,0
174,Barbados,0,430,0
175,Bermuda ,0,54,0
176,Bouvet Island,0,49,0
177,British Indian Ocean Territory,0,60,0
178,British Virgin Islands ,0,151,0
179,Cape Verde,0,4033,0
180,Cayman Islands ,0,264,0
181,Christmas Island,0,135,0
182,Cocos Islands,0,14,0
183,Comoros,0,1862,0
184,Cook Islands,0,236,0
185,Cuba,0,109886,0
186,Curaçao,0,444,0
187,Dominica,0,751,0
188,Falkland Islands  ,0,12173,0
189,Faroe Islands  (Denmark),0,1393,0
190,Federated States of Micronesia,0,702,0
191,Fiji,0,18272,0
192,French Polynesia,0,4000,0
193,French Southern and Antarctic Lands ,0,7747,0
194,Greenland  (Denmark),0,2166086,0
195,Grenada,0,344,0
196,Guadeloupe,0,1630,0
197,Guam,0,549,0
198,Guernsey ,0,78,0
199,Heard Island and McDonald Islands,0,412,0
200,Iceland,0,103000,0
201,Isle of Man ,0,572,0
202,Jamaica,0,10991,0
203,Japan,0,377930,0
204,Jersey,0,116,0
205,Kiribati,0,811,0
206,Madagascar,0,587041,0
207,Maldives,0,300,0
208,Malta,0,316,0
209,Marshall Islands,0,181,0
210,Martinique,0,1128,0
211,Mauritius,0,2040,0
212,Mayotte,0,374,0
213,Montserrat ,0,102,0
214,Nauru,0,21,0
215,New Caledonia,0,18575,0
216,New Zealand,0,270467,0
217,Niue (New Zealand),0,260,0
218,Norfolk Island,0,36,0
219,Northern Mariana Islands,0,464,0
220,Palau,0,459,0
221,Philippines,0,300000,0
222,Pitcairn Islands ,0,47,0
223,Puerto Rico,0,8870,0
224,Réunion,0,2513,0
225,Saint Barthélemy,0,21,0
226,Saint Helena, Ascension and Tristan da Cunha,0,308,0
227,Saint Kitts and Nevis,0,261,0
228,Saint Lucia,0,616,0
229,Saint Pierre and Miquelon,0,242,0
230,Saint Vincent and the Grenadines,0,389,0
231,Samoa,0,2842,0
232,São Tomé and Príncipe,0,964,0
233,Seychelles,0,452,0
234,Singapore,0,710,0
235,Solomon Islands,0,28896,0
236,South Georgia and the South Sandwich Islands ,0,3903,0
237,Svalbard  (Norway),0,62045,0
238,Taiwan,0,36193,0
239,Tokelau  (New Zealand),0,12,0
240,Tonga,0,747,0
241,Trinidad and Tobago,0,5130,0
242,Turks and Caicos Islands ,0,948,0
243,Tuvalu,0,26,0
244,United States Virgin Islands,0,347,0
245,Vanuatu,0,12189,0
246,Wallis and Futuna,0,142,0;`;

// eslint-disable-next-line no-useless-escape
const parsedData = data.split(/\r?\n/gm).map(t => t.split(/\,/g)) as [
  string,
  string,
  string,
  string,
  string
][];

export const getCountryAndTotalAreaInSqKm = Object.fromEntries(
  parsedData
    .map(
      ([
        _index,
        country,
        _landBorderLength,
        countrySurfaceArea,
        _suraceAreaToBorderRatio
      ]) => {
        return [country, countrySurfaceArea] as const;
      }
    )
    .toSorted(
      ([countryNameA, _landArea], [countryNameB, _landAreaB]) =>
        countryNameA.localeCompare(countryNameB) -
        countryNameB.localeCompare(countryNameA)
    )
);

console.log(getCountryAndTotalAreaInSqKm);



const countryTotalAreaInKm = {
  Afghanistan: "652230",
  Albania: "28748",
  Algeria: "2381741",
  "American Samoa": "199",
  Andorra: "468",
  Angola: "1246700",
  Anguilla: "91",
  "Antigua and Barbuda": "442",
  Argentina: "2780400",
  Armenia: "29743",
  Aruba: "180",
  Australia: "7692024",
  Austria: "83871",
  Azerbaijan: "86600",
  Bahamas: "13943",
  Bahrain: "765",
  Bangladesh: "143998",
  Barbados: "430",
  Belarus: "207600",
  Belgium: "30528",
  Belize: "22966",
  Benin: "112622",
  Bermuda: "54",
  Bhutan: "38394",
  Bolivia: "1098581",
  "Bosnia and Herzegovina": "51197",
  Botswana: "582000",
  "Bouvet Island": "49",
  Brazil: "8514877",
  "British Indian Ocean Territory": "60",
  "British Virgin Islands": "151",
  "Brunei Darussalam": "5765",
  Bulgaria: "110879",
  "Burkina Faso": "272967",
  Burundi: "27834",
  "Cabo Verde": "4033",
  Cambodia: "181035",
  Cameroon: "475442",
  Canada: "9984670",
  "Cayman Islands": "264",
  "Central African Republic": "622984",
  Chad: "1284000",
  Chile: "756102",
  China: "9596961",
  "Christmas Island": "135",
  "Cocos Islands": "14",
  Colombia: "1141748",
  Comoros: "1862",
  "Congo Republic": "342000",
  "Cook Islands": "236",
  "Costa Rica": "51100",
  "Côte d'Ivoire": "322463",
  Croatia: "56594",
  Cuba: "109886",
  "Curaçao": "444",
  Cyprus: "9251",
  Czechia: "78865",
  "Democratic People's Republic of Korea": "120538",
  "Democratic Republic of the Congo": "2344858",
  Denmark: "43094",
  Djibouti: "23200",
  Dominica: "751",
  "Dominican Republic": "48671",
  Ecuador: "256369",
  Egypt: "1002000",
  "El Salvador": "21041",
  "Equatorial Guinea": "28051",
  Eritrea: "117600",
  Estonia: "45227",
  Eswatini: "17364",
  Ethiopia: "1104300",
  "Falkland Islands": "12173",
  "Faroe Islands": "1393",
  "Micronesia": "702",
  Fiji: "18272",
  Finland: "338424",
  France: "551500",
  "French Guiana": "83534",
  "French Polynesia": "4000",
  "French Southern Territories": "7747",
  Gabon: "267668",
  Gambia: "11295",
  Georgia: "69700",
  Germany: "357114",
  Ghana: "238533",
  Gibraltar: "6",
  Greece: "131957",
  "Greenland": "2166086",
  Grenada: "344",
  Guadeloupe: "1630",
  Guam: "549",
  Guatemala: "108889",
  Guernsey: "78",
  Guinea: "245857",
  "Guinea-Bissau": "36125",
  Guyana: "214969",
  Haiti: "27750",
  "Heard Island and McDonald Islands": "412",
  Honduras: "112492",
  "Hong Kong": "1104",
  Hungary: "93028",
  Iceland: "103000",
  India: "3166414",
  Indonesia: "1910931",
  "Islamic Republic of Iran": "1648195",
  Iraq: "438317",
  Ireland: "70273",
  "Isle of Man": "572",
  Israel: "20770",
  Italy: "301336",
  Jamaica: "10991",
  Japan: "377930",
  Jersey: "116",
  Jordan: "89342",
  Kazakhstan: "2724900",
  Kenya: "580367",
  Kiribati: "811",
  Kosovo: "10887",
  Kuwait: "17818",
  Kyrgyzstan: "199951",
  "Lao People's Democratic Republic": "236800",
  Latvia: "64559",
  Lebanon: "10452",
  Lesotho: "30355",
  Liberia: "111369",
  Libya: "1759540",
  Liechtenstein: "160",
  Lithuania: "65300",
  Luxembourg: "2586",
  Macao: "30",
  Madagascar: "587041",
  Malawi: "118484",
  Malaysia: "330803",
  Maldives: "300",
  Mali: "1240192",
  Malta: "316",
  "Marshall Islands": "181",
  Martinique: "1128",
  Mauritania: "1025520",
  Mauritius: "2040",
  Mayotte: "374",
  Mexico: "1964375",
  Monaco: "2",
  Mongolia: "1564110",
  Montenegro: "13812",
  Montserrat: "102",
  Morocco: "446550",
  Mozambique: "801590",
  Myanmar: "676578",
  Namibia: "824268",
  Nauru: "21",
  Nepal: "147181",
  Netherlands: "41528",
  "New Caledonia": "18575",
  "New Zealand": "270467",
  Nicaragua: "130373",
  Niger: "1267000",
  Nigeria: "923768",
  "Niue": "260",
  "Norfolk Island": "36",
  "North Macedonia": "25713",
  "Northern Mariana Islands": "464",
  Norway: "323802",
  Oman: "309500",
  Pakistan: "796095",
  Palau: "459",
  Panama: "75417",
  "Papua New Guinea": "462840",
  Paraguay: "406752",
  Peru: "1285216",
  Philippines: "300000",
  Pitcairn: "47",
  Poland: "312685",
  Portugal: "92090",
  "Puerto Rico": "8870",
  Qatar: "11586",
  "Republic of Korea": "99828",
  "Republic of Moldova": "33846",
  Réunion: "2513",
  Romania: "238391",
  "Russian Federation": "17098242",
  Rwanda: "26338",
  "Saint Barthélemy": "21",
  "Saint Helena, Ascension, and Tristan da Cunha": "0",
  "Saint Kitts and Nevis": "261",
  "Saint Lucia": "616",
  "Saint Martin": "54",
  "Saint Pierre and Miquelon": "242",
  "Saint Vincent and the Grenadines": "389",
  Samoa: "2842",
  "San Marino": "61",
  "Sao Tome and Principe": "964",
  "Saudi Arabia": "2149690",
  Senegal: "196722",
  Serbia: "88361",
  Seychelles: "452",
  "Sierra Leone": "71740",
  Singapore: "710",
  "Sint Maarten": "34",
  Slovakia: "49037",
  Slovenia: "20273",
  "Solomon Islands": "28896",
  Somalia: "637657",
  "South Africa": "1221037",
  "South Georgia and the South Sandwich Islands": "3903",
  "South Sudan": "644329",
  Spain: "505992",
  "Sri Lanka": "65610",
  "State of Palestine": "6220",
  Sudan: "1861484",
  Suriname: "163820",
  "Svalbard and Jan Mayen": "62045",
  Sweden: "450295",
  Switzerland: "41284",
  "Syrian Arab Republic": "185180",
  Taiwan: "36193",
  Tajikistan: "143100",
  Thailand: "513120",
  "Timor-Leste": "14874",
  Togo: "56785",
  "Tokelau": "12",
  Tonga: "747",
  "Trinidad and Tobago": "5130",
  Tunisia: "163610",
  Türkiye: "783562",
  Turkmenistan: "488100",
  "Turks and Caicos Islands": "948",
  Tuvalu: "26",
  Uganda: "241550",
  Ukraine: "603500",
  "United Arab Emirates": "83600",
  "United Kingdom": "242900",
  "United Republic of Tanzania": "945087",
  "United States of America": "9526468",
  "the Virgin Islands of the United States": "347",
  Uruguay: "181034",
  Uzbekistan: "447400",
  Vanuatu: "12189",
  "Holy See": "0.44",
  "Venezuela (Bolivarian Republic of)": "912050",
  "Viet Nam": "331212",
  "Wallis and Futuna": "142",
  "Western Sahara": "266000",
  Yemen: "527968",
  Zambia: "752612",
  Zimbabwe: "390757"
};

const topoDataByCountryNameKey = {
  Afghanistan: "AF:AFG:004",
  "Åland Islands": "AX:ALA:248",
  Albania: "AL:ALB:008",
  Algeria: "DZ:DZA:012",
  "American Samoa": "AS:ASM:016",
  Andorra: "AD:AND:020",
  Angola: "AO:AGO:024",
  Anguilla: "AI:AIA:660",
  Antarctica: "AQ:ATA:010",
  "Antigua and Barbuda": "AG:ATG:028",
  Argentina: "AR:ARG:032",
  Armenia: "AM:ARM:051",
  Aruba: "AW:ABW:533",
  Australia: "AU:AUS:036",
  Austria: "AT:AUT:040",
  Azerbaijan: "AZ:AZE:031",
  Bahamas: "BS:BHS:044",
  Bahrain: "BH:BHR:048",
  Bangladesh: "BD:BGD:050",
  Barbados: "BB:BRB:052",
  Belarus: "BY:BLR:112",
  Belgium: "BE:BEL:056",
  Belize: "BZ:BLZ:084",
  Benin: "BJ:BEN:204",
  Bermuda: "BM:BMU:060",
  Bhutan: "BT:BTN:064",
  Bolivia: "BO:BOL:068",
  "Bonaire, Sint Eustatius, and Saba": "BQ:BES:535",
  "Bosnia and Herzegovina": "BA:BIH:070",
  Botswana: "BW:BWA:072",
  "Bouvet Island": "BV:BVT:074",
  Brazil: "BR:BRA:076",
  "British Indian Ocean Territory": "IO:IOT:086",
  "British Virgin Islands": "VG:VGB:092",
  "Brunei Darussalam": "BN:BRN:096",
  Bulgaria: "BG:BGR:100",
  "Burkina Faso": "BF:BFA:854",
  Burundi: "BI:BDI:108",
  "Cabo Verde": "CV:CPV:132",
  Cambodia: "KH:KHM:116",
  Cameroon: "CM:CMR:120",
  Canada: "CA:CAN:124",
  "Cayman Islands": "KY:CYM:136",
  "Central African Republic": "CF:CAF:140",
  Chad: "TD:TCD:148",
  Chile: "CL:CHL:152",
  China: "CN:CHN:156",
  "Christmas Island": "CX:CXR:162",
  "Cocos Islands": "CC:CCK:166",
  Colombia: "CO:COL:170",
  Comoros: "KM:COM:174",
  "Congo Republic": "CG:COG:178",
  "Cook Islands": "CK:COK:184",
  "Costa Rica": "CR:CRI:188",
  "Côte d'Ivoire": "CI:CIV:384",
  Croatia: "HR:HRV:191",
  Cuba: "CU:CUB:192",
  Curaçao: "CW:CUW:531",
  Cyprus: "CY:CYP:196",
  Czechia: "CZ:CZE:203",
  "Democratic People's Republic of Korea": "KP:PRK:408",
  "Democratic Republic of the Congo": "CD:COD:180",
  Denmark: "DK:DNK:208",
  Djibouti: "DJ:DJI:262",
  Dominica: "DM:DMA:212",
  "Dominican Republic": "DO:DOM:214",
  Ecuador: "EC:ECU:218",
  Egypt: "EG:EGY:818",
  "El Salvador": "SV:SLV:222",
  "Equatorial Guinea": "GQ:GNQ:226",
  Eritrea: "ER:ERI:232",
  Estonia: "EE:EST:233",
  Eswatini: "SZ:SWZ:748",
  Ethiopia: "ET:ETH:231",
  "Falkland Islands": "FK:FLK:238",
  "Faroe Islands": "FO:FRO:234",
  Fiji: "FJ:FJI:242",
  Finland: "FI:FIN:246",
  France: "FR:FRA:250",
  "French Guiana": "GF:GUF:254",
  "French Polynesia": "PF:PYF:258",
  "French Southern Territories": "TF:ATF:260",
  Gabon: "GA:GAB:266",
  Gambia: "GM:GMB:270",
  Georgia: "GE:GEO:268",
  Germany: "DE:DEU:276",
  Ghana: "GH:GHA:288",
  Gibraltar: "GI:GIB:292",
  Greece: "GR:GRC:300",
  Greenland: "GL:GRL:304",
  Grenada: "GD:GRD:308",
  Guadeloupe: "GP:GLP:312",
  Guam: "GU:GUM:316",
  Guatemala: "GT:GTM:320",
  Guernsey: "GG:GGY:831",
  Guinea: "GN:GIN:324",
  "Guinea-Bissau": "GW:GNB:624",
  Guyana: "GY:GUY:328",
  Haiti: "HT:HTI:332",
  "Heard Island and McDonald Islands": "HM:HMD:334",
  "Holy See": "VA:VAT:336",
  Honduras: "HN:HND:340",
  "Hong Kong": "HK:HKG:344",
  Hungary: "HU:HUN:348",
  Iceland: "IS:ISL:352",
  India: "IN:IND:356",
  Indonesia: "ID:IDN:360",
  Iraq: "IQ:IRQ:368",
  Ireland: "IE:IRL:372",
  "Islamic Republic of Iran": "IR:IRN:364",
  "Isle of Man": "IM:IMN:833",
  Israel: "IL:ISR:376",
  Italy: "IT:ITA:380",
  Jamaica: "JM:JAM:388",
  Japan: "JP:JPN:392",
  Jersey: "JE:JEY:832",
  Jordan: "JO:JOR:400",
  Kazakhstan: "KZ:KAZ:398",
  Kenya: "KE:KEN:404",
  Kiribati: "KI:KIR:296",
  Kosovo: "XK:XKX:383",
  Kuwait: "KW:KWT:414",
  Kyrgyzstan: "KG:KGZ:417",
  "Lao People's Democratic Republic": "LA:LAO:418",
  Latvia: "LV:LVA:428",
  Lebanon: "LB:LBN:422",
  Lesotho: "LS:LSO:426",
  Liberia: "LR:LBR:430",
  Libya: "LY:LBY:434",
  Liechtenstein: "LI:LIE:438",
  Lithuania: "LT:LTU:440",
  Luxembourg: "LU:LUX:442",
  Macao: "MO:MAC:446",
  Madagascar: "MG:MDG:450",
  Malawi: "MW:MWI:454",
  Malaysia: "MY:MYS:458",
  Maldives: "MV:MDV:462",
  Mali: "ML:MLI:466",
  Malta: "MT:MLT:470",
  "Marshall Islands": "MH:MHL:584",
  Martinique: "MQ:MTQ:474",
  Mauritania: "MR:MRT:478",
  Mauritius: "MU:MUS:480",
  Mayotte: "YT:MYT:175",
  Mexico: "MX:MEX:484",
  Micronesia: "FM:FSM:583",
  Monaco: "MC:MCO:492",
  Mongolia: "MN:MNG:496",
  Montenegro: "ME:MNE:499",
  Montserrat: "MS:MSR:500",
  Morocco: "MA:MAR:504",
  Mozambique: "MZ:MOZ:508",
  Myanmar: "MM:MMR:104",
  Namibia: "NA:NAM:516",
  Nauru: "NR:NRU:520",
  Nepal: "NP:NPL:524",
  Netherlands: "NL:NLD:528",
  "New Caledonia": "NC:NCL:540",
  "New Zealand": "NZ:NZL:554",
  Nicaragua: "NI:NIC:558",
  Niger: "NE:NER:562",
  Nigeria: "NG:NGA:566",
  Niue: "NU:NIU:570",
  "Norfolk Island": "NF:NFK:574",
  "North Macedonia": "MK:MKD:807",
  "Northern Mariana Islands": "MP:MNP:580",
  Norway: "NO:NOR:578",
  Oman: "OM:OMN:512",
  Pakistan: "PK:PAK:586",
  Palau: "PW:PLW:585",
  Panama: "PA:PAN:591",
  "Papua New Guinea": "PG:PNG:598",
  Paraguay: "PY:PRY:600",
  Peru: "PE:PER:604",
  Philippines: "PH:PHL:608",
  Pitcairn: "PN:PCN:612",
  Poland: "PL:POL:616",
  Portugal: "PT:PRT:620",
  "Puerto Rico": "PR:PRI:630",
  Qatar: "QA:QAT:634",
  "Republic of Korea": "KR:KOR:410",
  "Republic of Moldova": "MD:MDA:498",
  Réunion: "RE:REU:638",
  Romania: "RO:ROU:642",
  "Russian Federation": "RU:RUS:643",
  Rwanda: "RW:RWA:646",
  "Saint Barthélemy": "BL:BLM:652",
  "Saint Helena, Ascension, and Tristan da Cunha": "SH:SHN:654",
  "Saint Kitts and Nevis": "KN:KNA:659",
  "Saint Lucia": "LC:LCA:662",
  "Saint Martin": "MF:MAF:663",
  "Saint Pierre and Miquelon": "PM:SPM:666",
  "Saint Vincent and the Grenadines": "VC:VCT:670",
  Samoa: "WS:WSM:882",
  "San Marino": "SM:SMR:674",
  "Sao Tome and Principe": "ST:STP:678",
  "Saudi Arabia": "SA:SAU:682",
  Senegal: "SN:SEN:686",
  Serbia: "RS:SRB:688",
  Seychelles: "SC:SYC:690",
  "Sierra Leone": "SL:SLE:694",
  Singapore: "SG:SGP:702",
  "Sint Maarten": "SX:SXM:534",
  Slovakia: "SK:SVK:703",
  Slovenia: "SI:SVN:705",
  "Solomon Islands": "SB:SLB:090",
  Somalia: "SO:SOM:706",
  "South Africa": "ZA:ZAF:710",
  "South Georgia and the South Sandwich Islands": "GS:SGS:239",
  "South Sudan": "SS:SSD:728",
  Spain: "ES:ESP:724",
  "Sri Lanka": "LK:LKA:144",
  "State of Palestine": "PS:PSE:275",
  Sudan: "SD:SDN:729",
  Suriname: "SR:SUR:740",
  "Svalbard and Jan Mayen": "SJ:SJM:744",
  Sweden: "SE:SWE:752",
  Switzerland: "CH:CHE:756",
  "Syrian Arab Republic": "SY:SYR:760",
  Taiwan: "TW:TWN:158",
  Tajikistan: "TJ:TJK:762",
  Thailand: "TH:THA:764",
  "the Virgin Islands of the United States": "VI:VIR:850",
  "Timor-Leste": "TL:TLS:626",
  Togo: "TG:TGO:768",
  Tokelau: "TK:TKL:772",
  Tonga: "TO:TON:776",
  "Trinidad and Tobago": "TT:TTO:780",
  Tunisia: "TN:TUN:788",
  Türkiye: "TR:TUR:792",
  Turkmenistan: "TM:TKM:795",
  "Turks and Caicos Islands": "TC:TCA:796",
  Tuvalu: "TV:TUV:798",
  Uganda: "UG:UGA:800",
  Ukraine: "UA:UKR:804",
  "United Arab Emirates": "AE:ARE:784",
  "United Kingdom": "GB:GBR:826",
  "United Republic of Tanzania": "TZ:TZA:834",
  "United States Minor Outlying Islands": "UM:UMI:581",
  "United States of America": "US:USA:840",
  Uruguay: "UY:URY:858",
  Uzbekistan: "UZ:UZB:860",
  Vanuatu: "VU:VUT:548",
  "Venezuela (Bolivarian Republic of)": "VE:VEN:862",
  "Viet Nam": "VN:VNM:704",
  "Wallis and Futuna": "WF:WLF:876",
  "Western Sahara": "EH:ESH:732",
  Yemen: "YE:YEM:887",
  Zambia: "ZM:ZMB:894",
  Zimbabwe: "ZW:ZWE:716"
};


function createMatrix(rows: number, cols: number, initialValue: number) {
  const matrix = Array.of<number[]>();
  for (let r = 0; r < rows; r++) {
    const row = new Array<number>(cols).fill(initialValue);
    matrix.push(row);
  }
  return matrix;
}

function inBounds(matrix: number[][], row: number, col: number) {
  if (!matrix[row]) return false;
  return (
    row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length
  );
}
function getCell(matrix: number[][], row: number, col: number) {
  if (!matrix[row]) {
    throw new Error(`getRow: row does not exist`);
  }
  if (!inBounds(matrix, row, col) || !matrix[row][col]) 0;
  return matrix[row][col];
}
function setCell(
  matrix: number[][],
  row: number,
  col: number,
  value: number
): boolean {
  if (!matrix[row]) return false;
  if (!inBounds(matrix, row, col)) {
    return false;
  }
  matrix[row][col] = value;
  return true;
}
/**
 * Computes the Levenshtein distance between two strings, i.e.,
 * the minimum number of single-character edits (insertions,
 * deletions, or substitutions) needed to transform `a` into `b`.
 */
function levenshteinDistance(
  a?: string | null,
  b?: string | null
): number {
  const strA = a ?? "";
  const strB = b ?? "";

  // Build the DP matrix of size (strA.length+1) x (strB.length+1).
  const dp = createMatrix(strA.length + 1, strB.length + 1, 0);

  // Fill the dp matrix
  for (let i = 0; i < dp.length; i++) {
    for (let j = 0; j < (dp[i] ?? []).length; j++) {
      if (i === 0) {
        // If first row => cost = j (all insertions)
        setCell(dp, i, j, j);
      } else if (j === 0) {
        // If first column => cost = i (all deletions)
        setCell(dp, i, j, i);
      } else {
        // Compare the characters from strA, strB
        const charA = strA[i - 1];
        const charB = strB[j - 1];

        if (charA === charB) {
          // Characters match => copy diagonal
          const diag = getCell(dp, i - 1, j - 1);
          setCell(dp, i, j, diag);
        } else {
          // If different => 1 + min(deletion, insertion, substitution)
          const top = getCell(dp, i - 1, j); // deletion
          const left = getCell(dp, i, j - 1); // insertion
          const diag = getCell(dp, i - 1, j - 1); // substitution
          const val = 1 + Math.min(top, left, diag);
          setCell(dp, i, j, val);
        }
      }
    }
  }

  // Return the bottom-right cell: dp[strA.length][strB.length]
  return getCell(dp, strA.length, strB.length);
}

function similarityScore(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  // Could also scale by the length of the longer string
  const maxLen = Math.max(str1.length, str2.length);
  return 1 - distance / maxLen;
}

/**
 * Find exact and fuzzy matches between:
 *  - countryTotalAreaInKm (leftObj)
 *  - topoDataByCountryNameKey (rightObj)
 */
function findCountryMatches(
  leftObj: Record<string, string>,
  rightObj: Record<string, string>,
  fuzzyThreshold=0.7 // default threshold for "close enough"
) {
  const results = {
    exactMatches: {} as Record<string, { area: string; isoCode: string }>,
    fuzzyMatches: Array.of<{leftCountry: string,
    rightCandidate: string;
    similarity: number;}>(),
    noMatchFound: Array.of<string>(),
  };

  const rightKeys = Object.keys(rightObj);

  for (const leftKey of Object.keys(leftObj)) {
    // 1) Check for an exact match
    if (!leftObj[leftKey]) throw new Error("no left obj left key");
    if (rightObj[leftKey]) {
      results.exactMatches[leftKey] = {
        area: leftObj[leftKey],
        isoCode: rightObj[leftKey],
      };
      continue;
    }

    // 2) If no exact match, do a fuzzy comparison
    let bestMatch = {
      countryName: "",
      score: 0,
    };

    for (const rightKey of rightKeys) {
      const score = similarityScore(leftKey, rightKey);
      if (score > bestMatch.score) {
        bestMatch = { countryName: rightKey, score };
      }
    }

    // 3) Check if the best fuzzy match is good enough
    if (bestMatch.score >= fuzzyThreshold) {
      results.fuzzyMatches.push({
        leftCountry: leftKey,
        rightCandidate: bestMatch.countryName,
        similarity: bestMatch.score,
      });
    } else {
      results.noMatchFound.push(leftKey);
    }
  }

  return results;
}

// --- Sample usage (with your data objects) ---
const matches = findCountryMatches(countryTotalAreaInKm, topoDataByCountryNameKey, 0.75);
console.log(JSON.stringify(matches, null, 2));

const g = Object.fromEntries(Object.entries(matches.exactMatches).map(([countryName, {area, isoCode}]) => {
    const [alpha2, alpha3, threeNumberCode] = isoCode.split(/:/g) as [string, string, string];
    return [threeNumberCode, `${alpha2}:${alpha3}:${countryName}:${area}`]
}));


console.log(g);

```

- perform a cross-dataset match to extrapolate country area in sq km for an enriched dataset
