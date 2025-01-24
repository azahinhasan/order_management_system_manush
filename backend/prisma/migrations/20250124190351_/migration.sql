/*
  Warnings:

  - You are about to drop the column `grandTotal` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalDiscount` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "grandTotal",
DROP COLUMN "totalDiscount";
