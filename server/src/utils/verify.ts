import jwt, { type JwtPayload } from "jsonwebtoken";
import db from "../db/client.js";
export default async function verify_token(token: string) {
  const decodedToken = jwt.verify(
    token,
    "jsonwebtoken_personal_secret"
  ) as JwtPayload;
  if (!decodedToken) return { valid: false, user: null };

  const user = await db.user.findUnique({
    where: { id: decodedToken.id },
  });
  return { valid: true, user };
}
