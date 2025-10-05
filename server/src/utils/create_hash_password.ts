import bcrypt from "bcrypt";
export default function create_hash_password(password: string): string {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hash;
}
