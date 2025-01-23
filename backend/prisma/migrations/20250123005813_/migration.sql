/*
  Warnings:

  - You are about to drop the `ActionLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ActionLog";

-- CreateTable
CREATE TABLE "action_logs" (
    "id" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "refereceType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "context" TEXT,
    "description" TEXT,
    "additionalInfo" TEXT,
    "issuerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_logs_pkey" PRIMARY KEY ("id")
);
