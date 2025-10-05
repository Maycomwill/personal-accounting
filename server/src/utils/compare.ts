import { compareSync } from "bcrypt";

export default function compare_passwords(
  password: string,
  hashedPassword: string
): boolean {
  const verify = compareSync(password, hashedPassword);
  return verify;
}
