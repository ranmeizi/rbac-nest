export function randomString(length: number) {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let str = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * base.length);
    str += base[randomIndex];
  }

  return str;
}
