import { customAlphabet } from "nanoid";

export const getId = customAlphabet("1234567890abcdefghijklmnopqrztuvwxyz", 10);

export default getId;
