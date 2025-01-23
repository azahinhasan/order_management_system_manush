/*
  Warnings:

  - You are about to drop the `action_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "action_logs";

-- CreateTable
CREATE TABLE "actionLog" (
    "id" TEXT NOT NULL,
    "referenceId" TEXT,
    "refereceType" TEXT,
    "action" TEXT NOT NULL,
    "context" TEXT,
    "description" TEXT,
    "additionalInfo" TEXT,
    "issuerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actionLog_pkey" PRIMARY KEY ("id")
);
