/*
  Warnings:

  - You are about to drop the column `discount` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "discount",
ADD COLUMN     "fixedDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "percentageDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "weightedDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0;
