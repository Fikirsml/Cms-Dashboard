-- AlterTable
ALTER TABLE "users" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';

-- Remove the temporary default after backfill is not needed for empty DB
ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP DEFAULT;
