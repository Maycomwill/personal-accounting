import jwt from "jsonwebtoken";

export default function generate_token(reminder: boolean, userId: string) {
  const expiresIn = reminder ? "30d" : "1d";
  const {sign} = jwt
  const token = sign({ userId }, "jsonwebtoken_personal_secret", {
    expiresIn,
  });
  return token;
}
