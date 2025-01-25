/*
  Warnings:

  - The values [COMPLETED] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Order_status_new" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "Order_status_new" USING ("status"::text::"Order_status_new");
ALTER TYPE "Order_status" RENAME TO "Order_status_old";
ALTER TYPE "Order_status_new" RENAME TO "Order_status";
DROP TYPE "Order_status_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
