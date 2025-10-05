import { PrismaClient } from "../generated/prisma/index.js";

const db = new PrismaClient({
  log: ["query"],
});

export default db;
