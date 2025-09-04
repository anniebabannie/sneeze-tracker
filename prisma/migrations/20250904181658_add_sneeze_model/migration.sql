-- CreateTable
CREATE TABLE "public"."Sneeze" (
    "id" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sneeze_pkey" PRIMARY KEY ("id")
);
