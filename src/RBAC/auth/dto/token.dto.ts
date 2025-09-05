export class TokenDto {
  access_token: string;
  refresh_token: string;
  expires_in: number | string;
  token_type: 'Bearer';
}
