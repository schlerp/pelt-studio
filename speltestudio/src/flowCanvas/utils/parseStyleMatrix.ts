export function parseMatrixString(mString: string) {
  if (mString !== "none") {
    return mString
      .replace("matrix(", "")
      .replace(")", "")
      .split(",")
      .map((i) => parseFloat(i));
  }
  return [0, 0, 0, 0, 0, 0];
}
