/*
  Warnings:

  - You are about to drop the column `quantity` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - Added the required column `orderWeight` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableWeight` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "quantity",
ADD COLUMN     "orderWeight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "quantity",
DROP COLUMN "weight",
ADD COLUMN     "availableWeight" DOUBLE PRECISION NOT NULL;
