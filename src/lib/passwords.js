import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SALT_BYTES = 16;
const KEY_BYTES = 64;

export async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES);
  const derivedKey = await scrypt(password, salt, KEY_BYTES);
  return `scrypt$${salt.toString("hex")}$${Buffer.from(derivedKey).toString("hex")}`;
}

export async function verifyPassword(password, storedPassword) {
  if (typeof password !== "string" || typeof storedPassword !== "string" || !storedPassword) {
    return { valid: false, needsRehash: false };
  }

  const [algorithm, saltHex, keyHex] = storedPassword.split("$");
  if (algorithm === "scrypt" && saltHex && keyHex) {
    try {
      const salt = Buffer.from(saltHex, "hex");
      const expected = Buffer.from(keyHex, "hex");
      if (salt.length !== SALT_BYTES || expected.length !== KEY_BYTES) {
        return { valid: false, needsRehash: false };
      }
      const actual = Buffer.from(await scrypt(password, salt, KEY_BYTES));
      return { valid: timingSafeEqual(actual, expected), needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  const supplied = Buffer.from(password);
  const legacy = Buffer.from(storedPassword);
  const valid =
    supplied.length === legacy.length &&
    supplied.length > 0 &&
    timingSafeEqual(supplied, legacy);
  return { valid, needsRehash: valid };
}
