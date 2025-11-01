/*
  Warnings:

  - You are about to drop the column `approved_labour_budget` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `average_days_of_employment_provided_per_household` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `average_wage_rate_per_day_per_person` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `total_exp` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `total_individuals_worked` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `women_persondays` on the `MgnregaPerformance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[districtId,fin_year,month]` on the table `MgnregaPerformance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `MgnregaPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MgnregaPerformance" DROP COLUMN "approved_labour_budget",
DROP COLUMN "average_days_of_employment_provided_per_household",
DROP COLUMN "average_wage_rate_per_day_per_person",
DROP COLUMN "remarks",
DROP COLUMN "total_exp",
DROP COLUMN "total_individuals_worked",
DROP COLUMN "women_persondays",
ADD COLUMN     "Approved_Labour_Budget" DOUBLE PRECISION,
ADD COLUMN     "Average_Wage_rate_per_day_per_person" DOUBLE PRECISION,
ADD COLUMN     "Average_days_of_employment_provided_per_Household" DOUBLE PRECISION,
ADD COLUMN     "Differently_abled_persons_worked" INTEGER,
ADD COLUMN     "Material_and_skilled_Wages" DOUBLE PRECISION,
ADD COLUMN     "Number_of_Completed_Works" INTEGER,
ADD COLUMN     "Number_of_GPs_with_NIL_exp" INTEGER,
ADD COLUMN     "Number_of_Ongoing_Works" INTEGER,
ADD COLUMN     "Persondays_of_Central_Liability_so_far" DOUBLE PRECISION,
ADD COLUMN     "Remarks" TEXT,
ADD COLUMN     "SC_persondays" DOUBLE PRECISION,
ADD COLUMN     "ST_persondays" DOUBLE PRECISION,
ADD COLUMN     "Total_Exp" DOUBLE PRECISION,
ADD COLUMN     "Total_Households_Worked" INTEGER,
ADD COLUMN     "Total_Individuals_Worked" INTEGER,
ADD COLUMN     "Wages" DOUBLE PRECISION,
ADD COLUMN     "Women_Persondays" DOUBLE PRECISION,
ADD COLUMN     "month" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MgnregaPerformance_districtId_fin_year_month_key" ON "MgnregaPerformance"("districtId", "fin_year", "month");
