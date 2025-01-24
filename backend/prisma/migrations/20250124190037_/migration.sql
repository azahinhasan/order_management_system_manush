/*
  Warnings:

  - You are about to drop the column `perUnit` on the `orders` table. All the data in the column will be lost.
  - Added the required column `perUnit` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "perUnit" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "perUnit";
