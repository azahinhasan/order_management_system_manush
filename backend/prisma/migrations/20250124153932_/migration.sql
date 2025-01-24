-- CreateTable
CREATE TABLE "error_logs" (
    "id" SERIAL NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "errorStack" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);
