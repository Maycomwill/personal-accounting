import jwt from "jsonwebtoken";
import db from "../db/client.js";
export default async function verify_token(token: string) {
  interface JwtPayload {
    iat: number;
    exp: number;
    id: string;
  }
  const decodedToken = jwt.verify(
    token,
    "jsonwebtoken_personal_secret"
  ) as JwtPayload;
  if (!decodedToken) return { valid: false, user: null };

  const user = await db.user.findFirst({
    where: { id: decodedToken.id },
  });
  return { valid: true, user };
}
