import { customAlphabet } from "nanoid/non-secure";

export function safeid(n: number = 10): string {
  return customAlphabet("abcdefghijklmnopqrztuvwxyz", n)();
}

export default safeid;
