import { SignJWT, importPKCS8 } from 'jose';
import { PRIVATEKEY } from 'src/constants';

export async function generateJWTToken() {
  try {
    const privateKey = await importPKCS8(PRIVATEKEY, 'EdDSA');

    const customHeader = {
      alg: 'EdDSA',
      kid: 'K5H2X59BT7',
    };

    const iat = Math.floor(Date.now() / 1000) - 30;
    const exp = iat + 900;

    const customPayload = {
      sub: '3EKT9H9NEE',
      iat,
      exp,
    };

    const token = await new SignJWT(customPayload)
      .setProtectedHeader(customHeader)
      .sign(privateKey);

    return token;
  } catch (error) {
    throw error;
  }
}
