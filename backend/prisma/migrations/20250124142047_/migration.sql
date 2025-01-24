-- CreateEnum
CREATE TYPE "Promotion_types" AS ENUM ('WEIGHTED', 'FIXED', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "promotions" ADD COLUMN     "type" "Promotion_types" NOT NULL DEFAULT 'WEIGHTED';
