/*
  Warnings:

  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `availableWeight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `perWeight` on the `promotions` table. All the data in the column will be lost.
  - Added the required column `availableQuantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentPrice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perQuantity` to the `promotions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `promotions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Order_status" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Unit_types" AS ENUM ('KG', 'GRAM', 'LITER', 'METER', 'PIECE');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
ADD COLUMN     "status" "Order_status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "availableWeight",
DROP COLUMN "price",
ADD COLUMN     "availableQuantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit" "Unit_types" NOT NULL;

-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "perWeight",
ADD COLUMN     "perQuantity" INTEGER NOT NULL,
ADD COLUMN     "unit" "Unit_types" NOT NULL;

-- DropEnum
DROP TYPE "OrderStatus";
