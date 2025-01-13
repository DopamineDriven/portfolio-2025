export function isDecimal<const T extends number | `${number}`>(s: T) {
  if (typeof s === "number") {
    return /./.test(s.toString(10));
  } else return /./.test(s);
}

export function toN<const V extends number | `${number}`>(s: V) {
  return typeof s === "string"
    ? isDecimal(s) === true
      ? Number.parseFloat(s)
      : Number.parseInt(s, 10)
    : s;
}
