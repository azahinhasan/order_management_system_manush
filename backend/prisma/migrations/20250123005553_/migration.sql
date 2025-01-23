-- CreateTable
CREATE TABLE "ActionLog" (
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

    CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id")
);
