import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: number;
  role: string;
}

export function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(payload: TokenPayload) {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  ) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as TokenPayload;
}