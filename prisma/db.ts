import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../src/generated/prisma/contract.d.ts";
import contractJson from "../src/generated/prisma/contract.json" with { type: "json" };

/**
 * Typed Prisma 8 client.
 *
 * The type (`Contract`) and the runtime value (`contractJson`) come from the
 * generated artifacts in src/generated/prisma, produced by `prisma contract emit`.
 *
 * Example:
 *   import { db } from "./db";
 *   const user = await db.orm.User.where({ email: "x@y.com" }).first();
 */
export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});
