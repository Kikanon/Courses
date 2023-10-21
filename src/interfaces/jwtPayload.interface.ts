export interface JwtPayload {
  name: string;
  sub: string;
  iat: number;
  exp: number;
}
