export function merge(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  let i = m - 1,
    j = n - 1,
    k = m + n - 1;

  // Merge in reverse order
  while (i >= 0 && j >= 0) {
    const n1i = nums1?.[i],
      n2j = nums2?.[j];

    if (typeof n1i === "number" && typeof n2j === "number") {
      if (n1i > n2j) {
        nums1[k] = n1i;
        i--;
      } else {
        nums1[k] = n2j;
        j--;
      }
      k--;
    }
  }

  // If nums2 still has elements, copy them over
  while (j >= 0) {
    const n2j = nums2?.[j];
    if (typeof n2j === "number") {
      nums1[k] = n2j;
      k--;
      j--;
    }
  }
}
const nums1 = [1, 2, 3, 0, 0, 0],
  nums2 = [2, 5, 6];
const m = 3,
  n = 3;
merge(nums1, m, nums2, n);
console.log(nums1);

function removeElement(nums: number[], val: number): number {
  // j will mark the position to place the next non-val element.
  let j = 0;
  // Loop through every element in the array.
  for (let i = 0; i < nums.length; i++) {
    // When the element is not equal to val, copy it to the "j" index.
    if (nums[i] !== val) {
      nums[j] = nums?.[i] ?? 0;
      j++;
    }
  }
  // j is now the count of non-val elements.
  return j;
}

// Example usage:
const nums = [3, 2, 2, 3];
const val = 3;
const k = removeElement(nums, val);
console.log(k, nums.slice(0, k));

function convert(s: string, numRows: number): string {
  if (numRows === 1) return s;

  const cycleLen = 2 * (numRows - 1);
  const result = Array.of<string>();

  for (let r = 0; r < numRows; r++) {
    for (let i = r; i < s.length; i += cycleLen) {
      result.push(s[i] ?? "");
      const diag = i + cycleLen - 2 * r;
      if (r !== 0 && r !== numRows - 1 && diag < s.length) {
        result.push(s[diag] ?? "");
      }
    }
  }

  return result.join("");
}

console.log(convert("PAYPALISHIRING", 4));

function strStr(haystack: string, needle: string) {
  haystack.indexOf(needle);
}

console.log(strStr("sadbutsad", "sad"));
console.log(strStr("leetcode", "leeto"));

function shortestPalindrome(s: string): string {
  function reverseString(s: string): string {
    let reversedString = "";
    for (let i = s.length - 1; i >= 0; i--) {
      reversedString += s[i];
    }
    return reversedString;
  }
  // KMP failure func
  const computePrefixFunction = <const T extends `${string}#${string}`>(
    str: T
  ): number[] => {
    const n = str.length;
    const lps = new Array<number>(n).fill(0);
    let j = 0;

    for (let i = 1; i < n; ) {
      if (str[i] === str[j]) {
        lps[i] = j + 1;
        j++;
        i++;
      } else {
        // fallback
        if (j > 0) {
          j = lps[j - 1] ?? 0;
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  };
  if (s.length === 0) return s;

  const rev = reverseString(s);
  const combined = `${s}#${rev}` as const;

  const prefixArr = computePrefixFunction(combined);

  const matchLen = prefixArr?.[prefixArr.length - 1] ?? 0;

  const leftover = rev.substring(0, rev.length - matchLen);

  return leftover + s;
}

/**
 * Computes the prefix-function (KMP "failure function") for a given string.
 * prefixArr[i] = length of the longest proper prefix of str[0..i]
 *               which is also a suffix of str[0..i].
 */
// function computePrefixFunction(str: string): number[] {
//   const n = str.length;
//   const prefixArr = new Array<number>(n).fill(0);

//   let j = 0;
//   for (let i = 1; i < n; ) {
//     if (str[i] === str[j]) {
//       prefixArr[i] = j + 1;
//       j++;
//       i++;
//     } else if (j > 0 && prefixArr[j - 1]) {
//       j = prefixArr[j - 1] ?? 0;
//     } else {
//       prefixArr[i] = 0;
//       i++;
//     }
//   }
//   return prefixArr;
// }

// Examples:
console.log(shortestPalindrome("aacecaaa")); // "aaacecaaa"
console.log(shortestPalindrome("abcd")); // "dcbabcd"
console.log(shortestPalindrome("abcd"));

function minArea(image: string[][], x: number, y: number): number {
  const m = image.length;
  const n = image?.[0]?.length ?? 0;

  // Keep track of visited pixels to avoid re-processing
  const visited = Array.from({ length: m }, () =>
    new Array<boolean>(n).fill(false)
  );

  // Bounding box variables
  let minRow = m,
    maxRow = -1;
  let minCol = n,
    maxCol = -1;

  // Directions for exploring up, down, left, right
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ] as const;

  function dfs(r: number, c: number): void {
    // Mark current as visited
    if (typeof visited?.[r]?.[c] !== "boolean") return;
    visited[r][c] = true;

    // Update bounding box
    minRow = Math.min(minRow, r);
    maxRow = Math.max(maxRow, r);
    minCol = Math.min(minCol, c);
    maxCol = Math.max(maxCol, c);

    // Explore neighbors
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      // Check boundaries, connectivity, and visited status
      if (
        nr >= 0 &&
        nr < m &&
        nc >= 0 &&
        nc < n &&
        !visited?.[nr]?.[nc] &&
        image?.[nr]?.[nc] === "1"
      ) {
        dfs(nr, nc);
      }
    }
  }

  // Run DFS from the given black pixel
  dfs(x, y);

  // Compute area of the bounding rectangle
  const height = maxRow - minRow + 1;
  const width = maxCol - minCol + 1;
  return height * width;
}

// Example usage:
const image1 = [
  ["0", "0", "1", "0"],
  ["0", "1", "1", "0"],
  ["0", "1", "0", "0"]
];
console.log(minArea(image1, 0, 2)); // 6

const image2 = [["1"]];
console.log(minArea(image2, 0, 0)); // 1
