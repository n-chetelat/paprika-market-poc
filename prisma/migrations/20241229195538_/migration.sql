-- CreateTable
CREATE TABLE "StripeDisabledReason" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeDisabledReason_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripeDisabledReason" ADD CONSTRAINT "StripeDisabledReason_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
