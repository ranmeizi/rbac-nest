export class TokenDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}
