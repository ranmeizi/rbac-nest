import * as crypto from 'crypto';

export function randomString(length: number) {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let str = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * base.length);
    str += base[randomIndex];
  }

  return str;
}

export function secureRandomString(length = 6) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}
