/**
 * @type {import("ts-jest").ConfigSet}
 */
module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\.(m|c)?(j|t)sx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "cts",
    "mts",
    "mjs",
    "cjs",
    "js",
    "jsx",
    "json",
    "json5",
    "node"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist"
  ],
  preset: "ts-jest"
};
