-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "holiday_name" TEXT NOT NULL,
    "holiday_date" TIMESTAMP(3) NOT NULL,
    "holiday_status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);
