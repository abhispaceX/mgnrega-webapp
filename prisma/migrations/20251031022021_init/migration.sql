-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MgnregaPerformance" (
    "id" SERIAL NOT NULL,
    "district_name" TEXT NOT NULL,
    "fin_year" TEXT NOT NULL,
    "workers_count" INTEGER NOT NULL,
    "households_worked" INTEGER NOT NULL,
    "payment_on_time_percent" DOUBLE PRECISION NOT NULL,
    "avg_days_employment" DOUBLE PRECISION NOT NULL,
    "total_expenditure_crores" DOUBLE PRECISION NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MgnregaPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "District_name_key" ON "District"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MgnregaPerformance_district_name_key" ON "MgnregaPerformance"("district_name");

-- AddForeignKey
ALTER TABLE "MgnregaPerformance" ADD CONSTRAINT "MgnregaPerformance_district_name_fkey" FOREIGN KEY ("district_name") REFERENCES "District"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
