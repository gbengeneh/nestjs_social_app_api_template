-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'TEXT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpiration" TIMESTAMP(3);
