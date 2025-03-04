import { Fs } from "@d0paminedriven/fs";
import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";

const iso = new Iso3166_1();

const _visitorData = [
  ["840", 70],
  ["250", 8],
  ["484", 5],
  ["056", 3],
  ["616", 2],
  ["642", 2],
  ["156", 2],
  ["756", 1],
  ["376", 1]
] as const satisfies readonly [string, number][];

const isoCountries = Object.fromEntries(
  Object.entries(iso.topoDataByCountryCode)
    .map(([key, val]) => {
      const [alpha2, alpha3, countryName] = iso.exciseColons(val);
      return [countryName, `${alpha2}:${alpha3}:${key}`] as [string, string];
    })
    .sort(
      ([keyA, _valA], [keyB, _valB]) =>
        keyA.localeCompare(keyB) - keyB.localeCompare(keyA)
    )
);

const fs = new Fs(process.cwd());

fs.withWs(
  "src/utils/__generated__/topo-data-by-country-name.ts",
  `export const topoDataByCountryNameKey = ${JSON.stringify(isoCountries, null, 2)} as const`
);

export function arrToObjOutput(target: string) {
  const [alpha2, alpha3, countryName, countryFlag] =
    iso.parseCountryDataAndFlag(target);

  return {
    alpha2,
    alpha3,
    countryCode: target,
    countryName,
    countryFlag
  };
}

console.log(iso.getAlpha2("642"));
// function createMatrix(rows: number, cols: number, fillValue: number) {
//   // Each row is an Array<number> of length `cols`, all set to `fillValue`
//   return Array.from<unknown, number[]>({ length: rows }, () => {
//     return Array.from<unknown, number>({ length: cols }, () => fillValue);
//   });
// }

/**
 * Creates a 2D matrix with the given row/col counts.
 * All cells start off filled with the `initialValue`.
 */
export function createMatrix(rows: number, cols: number, initialValue: number) {
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
  if (!inBounds(matrix, row, col) || !matrix[row][col]) {
    throw new Error(`getCell: out of bounds [${row}][${col}]`);
  }
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
export function levenshteinDistance(
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

export function similarityScore(str1: string, str2: string): number {
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
export function findCountryMatches(
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
// const matches = findCountryMatches(countryTotalAreaInKm, topoDataByCountryNameKey, 0.75);
// console.log(JSON.stringify(matches, null, 2));
