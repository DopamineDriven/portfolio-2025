/**
Regex to capture the float between brackets; the +- signs are used where negative values represent black being ahead and nonnegative values represent white being ahead
 */

export function extractBracketed(text: string) {
  const regex = /\[([-+]?\d+(\.\d+)?)\]/;

  const match = text.match(regex);
  if (!match?.[1]) {
    return 0;
  }

  // match[1] will be the numeric value as a string (e.g. "1.48")
  // will also work for "-1.48" if black was winning

  const floatValue = Number.parseFloat(match[1]);
  return floatValue;
}

// const textTest = [
//   "Move g1 → f3 (Nf3): [1.24]. White is winning. Depth 11.",
//   "Move d3 → e2 (Be2): [1.35]. White is winning. Depth 12.",
//   "Move e1 → g1 (O-O): [1.35]. White is winning. Depth 12.",
//   "Move a2 → a3 (a3): [1.55]. White is winning. Depth 12.",
//   "Move b2 → b4 (b4): [2.06]. White is winning. Depth 12.",
//   "Move c2 → c4 (c4): [-4.86]. Black is winning. Depth 12.",
//   "Move b1 → c3 (Nc3): [-4.76]. Black is winning. Depth 12."
// ];


// (async () => {
//   return textTest.map(p => {
//     const transform = extractBracketed(p);
//     return transform;
//   });
// })()
//   .then(val => {
//     console.log(val);
//     return val;
//   })
//   .catch(err => console.error(err));
