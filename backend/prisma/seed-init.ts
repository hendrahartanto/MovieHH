import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count === 0) {
    console.log("No users found in database. Running seed script...");
    execSync("npx prisma db seed", { stdio: "inherit" });
  } else {
    console.log("Database already populated. Skipping seeding.");
  }
}

main()
  .catch((e) => {
    console.error("Error checking or seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
