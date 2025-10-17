import * as argon2 from "argon2";

export async function hashPassword(password: string) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
  });
}

export async function verifyPassword(hashedPassword: string, password: string) {
  return await argon2.verify(hashedPassword, password);
}
