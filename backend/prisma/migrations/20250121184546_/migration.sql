/*
  Warnings:

  - You are about to drop the column `status` on the `promotions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
