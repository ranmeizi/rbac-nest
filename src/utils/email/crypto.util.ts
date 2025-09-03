import * as crypto from 'crypto';

const EMAIL_QUERY_AES = {
  key: '4db2ca928ae39a05',
  iv: '891bf307f17fe230',
};

// 参数加密
export function encryptSearch(params: Record<string, any>) {
  const plainText = JSON.stringify(params);
  // 密钥和 IV 必须是 8 字节
  const cipher = crypto.createCipheriv(
    'aes-128-cbc',
    Buffer.from(EMAIL_QUERY_AES.key),
    Buffer.from(EMAIL_QUERY_AES.iv),
  );
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encodeURIComponent(encrypted);
}

export function decryptSearch(encryptedText: string): Record<string, any> {
  const decipher = crypto.createDecipheriv(
    'aes-128-cbc',
    Buffer.from(EMAIL_QUERY_AES.key),
    Buffer.from(EMAIL_QUERY_AES.iv),
  );
  let decrypted = decipher.update(
    decodeURIComponent(encryptedText),
    'base64',
    'utf8',
  );
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}
