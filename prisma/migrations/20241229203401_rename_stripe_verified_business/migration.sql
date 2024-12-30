/*
  Warnings:

  - You are about to drop the column `isStripeLinked` on the `Business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "isStripeLinked",
ADD COLUMN     "isStripeVerified" BOOLEAN NOT NULL DEFAULT false;
