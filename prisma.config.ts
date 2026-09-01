import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "prisma/schema.prisma",
    // Generated contract artifacts (contract.json + contract.d.ts) land here.
    output: "src/generated/prisma",
    db: {
      connection: process.env["DATABASE_URL"]!,
    },
  }),
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});

