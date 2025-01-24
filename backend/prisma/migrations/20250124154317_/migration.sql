/*
  Warnings:

  - You are about to drop the `actionLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "actionLog";

-- CreateTable
CREATE TABLE "action_logs" (
    "id" TEXT NOT NULL,
    "referenceId" INTEGER,
    "refereceType" TEXT,
    "action" TEXT NOT NULL,
    "context" TEXT,
    "description" TEXT,
    "additionalInfo" TEXT,
    "issuerId" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_logs_pkey" PRIMARY KEY ("id")
);
