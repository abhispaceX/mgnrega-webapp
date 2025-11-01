/*
  Warnings:

  - You are about to drop the column `avg_days_employment` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `district_name` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `households_worked` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `payment_on_time_percent` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `total_expenditure_crores` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `workers_count` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - Added the required column `districtId` to the `MgnregaPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."MgnregaPerformance" DROP CONSTRAINT "MgnregaPerformance_district_name_fkey";

-- DropIndex
DROP INDEX "public"."MgnregaPerformance_district_name_key";

-- AlterTable
ALTER TABLE "MgnregaPerformance" DROP COLUMN "avg_days_employment",
DROP COLUMN "district_name",
DROP COLUMN "households_worked",
DROP COLUMN "payment_on_time_percent",
DROP COLUMN "total_expenditure_crores",
DROP COLUMN "workers_count",
ADD COLUMN     "approved_labour_budget" DOUBLE PRECISION,
ADD COLUMN     "average_days_of_employment_provided_per_household" DOUBLE PRECISION,
ADD COLUMN     "average_wage_rate_per_day_per_person" DOUBLE PRECISION,
ADD COLUMN     "districtId" INTEGER NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "total_exp" DOUBLE PRECISION,
ADD COLUMN     "total_individuals_worked" INTEGER,
ADD COLUMN     "women_persondays" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "MgnregaPerformance" ADD CONSTRAINT "MgnregaPerformance_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
