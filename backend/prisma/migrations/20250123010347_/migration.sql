/*
  Warnings:

  - The `referenceId` column on the `actionLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "actionLog" DROP COLUMN "referenceId",
ADD COLUMN     "referenceId" INTEGER;
